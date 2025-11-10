#!/bin/bash

# Create necessary directories
mkdir -p raw_docs docs temp

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

echo "Running Python processing script..."
# Call Python for processing
python scripts/process.py

echo "Cleaning up temporary files..."
# Clean up temp
rm -rf temp/

echo "Documentation aggregation completed!"

