#!/usr/bin/env python3
"""Lint docs for common issues: missing headings, long lines, trailing whitespace."""
import re
import sys
from pathlib import Path


def lint_file(path: Path):
    lines = path.read_text(encoding='utf-8').splitlines()
    issues = []
    # Check long lines
    for i, ln in enumerate(lines, start=1):
        if len(ln) > 120:
            issues.append((i, 'Line too long'))
        if ln.rstrip() != ln:
            issues.append((i, 'Trailing whitespace'))
    # check headings structure (file should have at least an H1)
    if not any(l.startswith('# ') for l in lines):
        issues.append((0, 'Missing H1 heading'))
    # code block consistency (``` followed by language)
    code_blocks = [ln for ln in lines if ln.strip().startswith('```')]
    if len(code_blocks) % 2 == 1:
        issues.append((0, 'Unbalanced code fence(s)'))
    return issues


def main():
    root = Path('docs')
    total = 0
    total_issues = 0
    for p in root.rglob('*.md'):
        total += 1
        issues = lint_file(p)
        if issues:
            print(p)
            for i, m in issues:
                print(f"  {i if i else '-'}: {m}")
            total_issues += len(issues)
    print(f"Checked {total} files; found {total_issues} issues.")
    return 1 if total_issues > 0 else 0


if __name__ == '__main__':
    sys.exit(main())
