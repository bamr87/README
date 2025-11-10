#!/bin/bash

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

# Read repo list and process each repository
while IFS= read -r repo; do
  # Skip empty lines and comments
  if [[ -z "$repo" || "$repo" =~ ^[[:space:]]*# ]]; then
    continue
  fi
  
  echo "Processing repository: $repo"
  repo_name=$(basename "$repo" .git)
  temp_dir="temp/$repo_name"
  mkdir -p "$temp_dir"

  # Clone or pull repo
  if [ -d "$temp_dir/.git" ]; then
    echo "Updating existing repository: $repo_name"
    git -C "$temp_dir" pull
  else
    echo "Cloning new repository: $repo_name"
    git clone "$repo" "$temp_dir"
  fi

  # Create destination directory for this repo
  mkdir -p "raw_docs/$repo_name"

  # Find doc files (e.g., .md in docs/ or README)
  echo "Finding documentation files in $repo_name..."
  find "$temp_dir" -type f \( -name "*.md" -o -name "README*" \) -not -path "*/.git/*" | while read -r file; do
    rel_path="${file#"$temp_dir"/}"
    dest_dir="raw_docs/$repo_name/$(dirname "$rel_path")"
    mkdir -p "$dest_dir"
    cp "$file" "raw_docs/$repo_name/$rel_path"
    echo "Copied: $rel_path"
  done
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

echo "Cleaning up temporary files..."
# Clean up temp
rm -rf temp/

echo "Documentation aggregation completed!"

