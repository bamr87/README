#!/usr/bin/env bash
# Run checks: lint, frontmatter check, clean (optional)
set -euo pipefail

echo "Running docs lint..."
python3 scripts/lint_docs.py || true

echo "Checking frontmatter..."
python3 scripts/check_frontmatter.py --quiet || true

echo "Cleaning frontmatter (dry run)..."
python3 scripts/clean_frontmatter.py || true

echo "Docs checks completed."
