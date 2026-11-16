#!/bin/bash
#
# Stage 1 of the crawl. For each repository in repos.txt (generated from
# _data/projects.yml by `python3 -m scripts.context_engine sync`), clone it
# into temp/, or fast-forward a clone an interrupted run left there, and copy
# its Markdown and README files into raw_docs/<repo>/. Then run stage 2
# (scripts/process.py) and the prose unwrap over docs/. Run it from the
# repository root: bash scripts/aggregate.sh
#
# A repository that cannot be fetched does not stop the others, but it fails
# the run: the failures are listed at the end and the script exits 1, so the
# scheduled aggregate-docs workflow stops before its commit step instead of
# publishing a stale or partial corpus.

set -euo pipefail

# Seconds one git clone or pull may run. timeout(1) enforces it where it
# exists (GNU coreutils, so the Ubuntu CI runners); macOS has none, and there
# git runs unbounded.
GIT_TIMEOUT_SECONDS=300

# Never wait on a credential prompt: a private or missing repository fails
# straight away instead of hanging until the timeout.
export GIT_TERMINAL_PROMPT=0

# Create necessary directories
mkdir -p raw_docs docs temp

# Ensure Python 3 is available and dependencies are installed (use venv if needed)
ensure_python() {
  # prefer python3
  if command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD=python3
  elif command -v python >/dev/null 2>&1; then
    PYTHON_CMD=python
  else
    # fallback to env python3 if present
    if command -v /usr/bin/env >/dev/null 2>&1 && /usr/bin/env python3 -V >/dev/null 2>&1; then
      PYTHON_CMD="/usr/bin/env python3"
    else
      echo "No python interpreter found. Aborting."
      exit 1
    fi
  fi

  # Install dependencies into a virtualenv if yaml/requests are not importable
  if ! $PYTHON_CMD -c "import yaml, requests" >/dev/null 2>&1; then
    echo "Creating virtual environment and installing requirements..."
    $PYTHON_CMD -m venv .venv
    # shellcheck disable=SC1091
    . .venv/bin/activate
    python -m pip install --upgrade pip
    if [ -f requirements.txt ]; then
      python -m pip install -r requirements.txt
    else
      python -m pip install pyyaml requests
    fi
  else
    echo "Python and required modules are available."
  fi
}

# Run git, bounded by GIT_TIMEOUT_SECONDS where timeout(1) exists. stdin is
# closed, so nothing git starts can read the rest of repos.txt.
run_git() {
  if command -v timeout >/dev/null 2>&1; then
    timeout "$GIT_TIMEOUT_SECONDS" git "$@" </dev/null
  else
    git "$@" </dev/null
  fi
}

# Clone one repository into temp/<repo>, or fast-forward the clone an
# interrupted run left there. The branch goes to git as --branch=<value> and
# the URL after --, so neither can be read as an option. Returns git's status.
fetch_repo() {
  local repo_url=$1 branch=$2 temp_dir=$3
  if [ -d "$temp_dir/.git" ]; then
    echo "Updating existing repository: $temp_dir"
    run_git -C "$temp_dir" pull --ff-only
  elif [ -n "$branch" ]; then
    echo "Cloning new repository: $repo_url (branch: $branch)"
    run_git clone --branch="$branch" -- "$repo_url" "$temp_dir"
  else
    echo "Cloning new repository: $repo_url"
    run_git clone -- "$repo_url" "$temp_dir"
  fi
}

# Copy a clone's Markdown and README files into raw_docs/<repo>/, keeping their
# paths. find -type f matches regular files only, so a symlink in the clone
# cannot pull a file from outside it into the corpus.
copy_docs() {
  local temp_dir=$1 repo_name=$2 file rel_path
  mkdir -p "raw_docs/$repo_name"
  echo "Finding documentation files in $repo_name..."
  find "$temp_dir" -type f \( -name "*.md" -o -name "README*" \) -not -path "*/.git/*" |
    while IFS= read -r file; do
      rel_path="${file#"$temp_dir"/}"
      mkdir -p "raw_docs/$repo_name/$(dirname "$rel_path")"
      cp "$file" "raw_docs/$repo_name/$rel_path"
      echo "Copied: $rel_path"
    done
}

# Read repo list and process each repository; a repository git cannot fetch
# is recorded here and fails the run once the others are done.
failed=()
while IFS= read -r repo; do
  # Skip empty lines and comments
  if [[ -z "$repo" || "$repo" =~ ^[[:space:]]*# ]]; then
    continue
  fi

  # Parse optional branch from URL (format: url#branch)
  branch=""
  repo_url="$repo"
  if [[ "$repo" == *"#"* ]]; then
    branch="${repo##*#}"
    repo_url="${repo%%#*}"
  fi

  echo "Processing repository: $repo_url${branch:+ (branch: $branch)}"
  repo_name=$(basename -- "$repo_url" .git)
  case "$repo_name" in
    "" | . | ..)
      echo "Skipping $repo_url: it names no repository directory" >&2
      failed+=("$repo")
      continue
      ;;
  esac

  if fetch_repo "$repo_url" "$branch" "temp/$repo_name"; then
    copy_docs "temp/$repo_name" "$repo_name"
  else
    status=$?
    reason="git exited $status"
    if [ "$status" -eq 124 ]; then
      reason="git timed out after ${GIT_TIMEOUT_SECONDS}s"
    fi
    echo "Failed to fetch $repo_url ($reason); its docs are not copied" >&2
    failed+=("$repo")
  fi
done < repos.txt

echo "Preparing Python and dependencies..."
ensure_python

echo "Running Python processing script..."
# Activate venv if present
if [ -f ".venv/bin/activate" ]; then
  # shellcheck disable=SC1091
  . .venv/bin/activate
fi
# Use $PYTHON_CMD chosen earlier (or python if within venv)
${PYTHON_CMD:-python} scripts/process.py

# Upstream repos hard-wrap their prose; this repo's markdown-oneline gate does
# not allow it. Normalizing at ingest - with the same exclusions the gate uses -
# keeps the crawl and the gate from rewriting each other's work on every
# refresh. Same idea as the icon normalizer in process.py: leave every page in
# a state the downstream gates accept.
echo "Unwrapping soft-wrapped prose (one paragraph per line)..."
${PYTHON_CMD:-python} tools/unwrap-prose.py --write docs \
  --exclude '(^|/)SCHEMA\.md$' --exclude '(^|/)CHANGELOG\.md$'

echo "Cleaning up temporary files..."
# Clean up temp
rm -rf temp/

if [ "${#failed[@]}" -gt 0 ]; then
  echo "Aggregation incomplete: ${#failed[@]} of the repositories in repos.txt could not be fetched:" >&2
  printf '  - %s\n' "${failed[@]}" >&2
  echo "Their pages in docs/ were left as they were; this crawl must not be published." >&2
  exit 1
fi

echo "Documentation aggregation completed!"
