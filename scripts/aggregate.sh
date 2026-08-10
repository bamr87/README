#!/usr/bin/env bash
#
# Stage 1 of the docs pipeline: clone every repo listed in repos.txt (generated
# from _data/projects.yml) and copy its Markdown into raw_docs/, then hand off
# to scripts/process.py (stage 2), which writes docs/<repo>/<original path>.
#
# CONTRACT: this script FAILS LOUDLY.
#
#   * A repo that cannot be cloned or pulled is a hard error. It used to be
#     swallowed -- `bamr87/skills` had 404'd for months while the workflow kept
#     reporting success and the site kept publishing a frozen copy of a repo
#     that no longer existed at that URL.
#   * A repo that yields implausibly few files (see COVERAGE_FLOOR_PCT) is a
#     hard error too: a wrong branch or a partial clone looks exactly like a
#     repo that lost 90% of its docs, and silently publishing the remnant is
#     worse than going red.
#
# On any failure nothing under docs/ is touched, so the corpus stays at its
# last known-good state and CI shows the problem instead of committing it.

set -uo pipefail

RAW_DIR="raw_docs"
DOCS_DIR="docs"
TEMP_DIR="temp"
REPOS_FILE="${REPOS_FILE:-repos.txt}"

# A repo must yield at least this percentage of the file count already in the
# committed corpus. Only applied when a corpus for that repo already exists.
COVERAGE_FLOOR_PCT="${COVERAGE_FLOOR_PCT:-50}"

failed_repos=()
aggregated_repos=()

# Agent-configuration files are instructions for agents working in the SOURCE
# repo. Re-publishing a second, always-stale copy of them here is actively
# misleading -- an agent reading the mirrored copy gets orders from a repo it
# is not in, frozen at the last aggregation run. Never aggregate them.
is_agent_config() {
  case "$1" in
    CLAUDE.md | */CLAUDE.md) return 0 ;;
    AGENTS.md | */AGENTS.md) return 0 ;;
    .github/copilot-instructions.md | */.github/copilot-instructions.md) return 0 ;;
    .github/instructions/* | */.github/instructions/*) return 0 ;;
    .github/prompts/* | */.github/prompts/*) return 0 ;;
    .github/agents/* | */.github/agents/*) return 0 ;;
    .claude/* | */.claude/*) return 0 ;;
  esac
  return 1
}

# Number of files currently committed under docs/<repo>/ (0 when new).
corpus_size() {
  local name="$1"
  if [ -d "$DOCS_DIR/$name" ]; then
    find "$DOCS_DIR/$name" -type f | wc -l | tr -d ' '
  else
    echo 0
  fi
}

# Ensure Python 3 is available and dependencies are installed (use venv if needed)
ensure_python() {
  # prefer python3
  if command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD=python3
  elif command -v python >/dev/null 2>&1; then
    PYTHON_CMD=python
  else
    echo "No python interpreter found. Aborting." >&2
    exit 1
  fi

  # Install dependencies into a virtualenv if yaml/requests are not importable
  if ! $PYTHON_CMD -c "import yaml, requests" >/dev/null 2>&1; then
    echo "Creating virtual environment and installing requirements..."
    $PYTHON_CMD -m venv .venv || exit 1
    # shellcheck disable=SC1091
    . .venv/bin/activate
    python -m pip install --upgrade pip
    if [ -f requirements.txt ]; then
      python -m pip install -r requirements.txt || exit 1
    else
      python -m pip install pyyaml requests || exit 1
    fi
    PYTHON_CMD=python
  else
    echo "Python and required modules are available."
  fi
}

# Prepare the interpreter first: a missing dependency must abort before any
# part of the corpus has been replaced.
echo "Preparing Python and dependencies..."
ensure_python

mkdir -p "$RAW_DIR" "$DOCS_DIR" "$TEMP_DIR"

if [ ! -f "$REPOS_FILE" ]; then
  echo "Missing $REPOS_FILE. Run: python3 -m scripts.context_engine sync" >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# Stage 1a: clone each repo and stage its docs under raw_docs/<repo>/
# ---------------------------------------------------------------------------
while IFS= read -r repo; do
  # Skip empty lines and comments (including "# skipped (aggregate: false)")
  if [[ -z "$repo" || "$repo" =~ ^[[:space:]]*# ]]; then
    continue
  fi

  # Parse optional branch from URL (format: url#branch)
  branch=""
  repo_url="$repo"
  case "$repo" in
    *"#"*)
      branch="${repo##*#}"
      repo_url="${repo%%#*}"
      ;;
  esac

  echo "Processing repository: $repo_url${branch:+ (branch: $branch)}"
  repo_name=$(basename "$repo_url" .git)
  repo_temp="$TEMP_DIR/$repo_name"

  # Always clone fresh. These are shallow, throwaway checkouts used only to
  # read files out of; reusing one and fast-forwarding it adds failure modes
  # (a shallow clone does not always fast-forward) for no benefit.
  rm -rf "$repo_temp"
  clone_ok=1
  if [ -n "$branch" ]; then
    git clone --depth 1 -b "$branch" "$repo_url" "$repo_temp" || clone_ok=0
  else
    git clone --depth 1 "$repo_url" "$repo_temp" || clone_ok=0
  fi
  if [ "$clone_ok" -ne 1 ]; then
    echo "::error::Failed to clone $repo_url${branch:+ (branch: $branch)}" >&2
    failed_repos+=("$repo_name (clone failed: $repo_url${branch:+#$branch})")
    continue
  fi

  # Stage this repo's docs, skipping agent configuration
  rm -rf "${RAW_DIR:?}/$repo_name"
  mkdir -p "$RAW_DIR/$repo_name"

  echo "Finding documentation files in $repo_name..."
  copied=0
  skipped=0
  while IFS= read -r file; do
    rel_path="${file#"$repo_temp"/}"
    if is_agent_config "$rel_path"; then
      skipped=$((skipped + 1))
      continue
    fi
    mkdir -p "$RAW_DIR/$repo_name/$(dirname "$rel_path")"
    cp "$file" "$RAW_DIR/$repo_name/$rel_path"
    copied=$((copied + 1))
  done < <(find "$repo_temp" -type f \( -name "*.md" -o -name "README*" \) -not -path "*/.git/*")

  echo "  staged $copied file(s); skipped $skipped agent-config file(s)"

  # Coverage assertion: an empty or drastically shrunken result is a bug, not
  # a legitimate corpus update.
  if [ "$copied" -eq 0 ]; then
    echo "::error::$repo_name yielded 0 documentation files" >&2
    failed_repos+=("$repo_name (0 files aggregated)")
    continue
  fi

  previous=$(corpus_size "$repo_name")
  if [ "$previous" -gt 0 ]; then
    floor=$((previous * COVERAGE_FLOOR_PCT / 100))
    if [ "$copied" -lt "$floor" ]; then
      echo "::error::$repo_name aggregated $copied file(s), below the ${COVERAGE_FLOOR_PCT}% floor of $floor (corpus currently has $previous)" >&2
      failed_repos+=("$repo_name (coverage drop: $copied < $floor)")
      continue
    fi
  fi

  aggregated_repos+=("$repo_name")
done <"$REPOS_FILE"

if [ "${#failed_repos[@]}" -gt 0 ]; then
  echo >&2
  echo "Aggregation FAILED for ${#failed_repos[@]} repo(s):" >&2
  for entry in "${failed_repos[@]}"; do
    echo "  - $entry" >&2
  done
  echo "docs/ left untouched. Fix the source (usually _data/projects.yml) and rerun." >&2
  rm -rf "${TEMP_DIR:?}"
  exit 1
fi

if [ "${#aggregated_repos[@]}" -eq 0 ]; then
  echo "::error::No repositories aggregated -- is $REPOS_FILE empty?" >&2
  rm -rf "${TEMP_DIR:?}"
  exit 1
fi

# ---------------------------------------------------------------------------
# Stage 1b: replace each aggregated repo's corpus wholesale.
#
# process.py only ever writes files, so without this a file deleted upstream
# stayed published forever. Only runs once every repo cloned cleanly, so a
# broken source can never wipe a section.
# ---------------------------------------------------------------------------
for repo_name in "${aggregated_repos[@]}"; do
  rm -rf "${DOCS_DIR:?}/$repo_name"
done

echo "Running Python processing script..."
if ! $PYTHON_CMD scripts/process.py; then
  echo "::error::scripts/process.py failed" >&2
  exit 1
fi

echo "Cleaning up temporary files..."
rm -rf "${TEMP_DIR:?}"

echo "Documentation aggregation completed for ${#aggregated_repos[@]} repo(s): ${aggregated_repos[*]}"
