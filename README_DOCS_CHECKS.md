Docs Checks and Utilities
=========================

This repo includes small utilities to validate and normalize documentation files aggregated into `docs/`.

Usage
-----

Basic checks and cleanups:

```bash
cd /path/to/README
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
bash scripts/run_doc_checks.sh
```

Tools
-----
- `scripts/lint_docs.py`: Lint markdown files for trailing whitespace, long lines (>120), missing H1, and broken code fences.
- `scripts/check_frontmatter.py`: Check YAML frontmatter; optionally fix missing `title`, `tags`, and `category` with `--fix`.
- `scripts/clean_frontmatter.py`: Normalizes frontmatter fields to canonical order and removes extraneous fields.
- `scripts/run_doc_checks.sh`: Wrapper that runs the three scripts above.

Notes
-----
- These utilities are lightweight and designed for local use or extension in CI. They do not modify content beyond basic frontmatter and small normalization if `--fix` is enabled.
