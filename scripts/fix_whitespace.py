#!/usr/bin/env python3
"""Remove trailing whitespace from Markdown files in docs/ and report stats."""
from pathlib import Path
import sys


def fix_file(p: Path):
    text = p.read_text(encoding='utf-8')
    lines = text.splitlines()
    new_lines = [ln.rstrip() for ln in lines]
    if '\n'.join(new_lines) != '\n'.join(lines):
        p.write_text('\n'.join(new_lines) + ('\n' if text.endswith('\n') else ''), encoding='utf-8')
        return True
    return False


def main():
    root = Path('docs')
    total = 0
    fixed = 0
    for p in root.rglob('*.md'):
        total += 1
        try:
            if fix_file(p):
                fixed += 1
        except Exception:
            pass
    print(f"Whitespace fixer: processed {total} files, fixed {fixed} files")
    return 0


if __name__ == '__main__':
    sys.exit(main())
