#!/usr/bin/env bash
# Run checks: lint, frontmatter check, clean (optional)
set -euo pipefail

APPLY_CHANGES=false
QUIET=false
while [[ $# -gt 0 ]]; do
	case "$1" in
		--apply)
			APPLY_CHANGES=true
			shift
			;;
		--quiet)
			QUIET=true
			shift
			;;
		*)
			echo "Unknown arg: $1"
			exit 1
			;;
	esac
done

echo "Running docs lint..."
if ! python3 scripts/lint_docs.py; then
	echo "Lint issues detected" >&2
	if [ "$APPLY_CHANGES" = false ]; then
		echo "Run with --apply to try to auto-fix safe issues (whitespace)." >&2
	fi
fi

echo "Checking frontmatter..."
if [ "$QUIET" = true ]; then
	python3 scripts/check_frontmatter.py --quiet || true
else
	python3 scripts/check_frontmatter.py || true
fi

if [ "$APPLY_CHANGES" = true ]; then
	echo "Applying recommended cleanups..."
	# fix whitespace first
	python3 scripts/fix_whitespace.py || true
	# normalize tags
	python3 scripts/normalize_tags.py || true
	# add missing h1 headings
	python3 scripts/fix_h1.py || true
	# normalize frontmatter
	python3 scripts/clean_frontmatter.py || true
else
	echo "Skipped clean frontmatter. Run with --apply to apply normalization changes."
fi

echo "Docs checks completed."
