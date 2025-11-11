#!/usr/bin/env python3
"""Add a top-level H1 (# Title) from frontmatter title or filename when missing."""
from pathlib import Path
import yaml
import sys


def has_h1(lines):
    for ln in lines:
        if ln.strip().startswith('# '):
            return True
    return False


def process_file(p: Path):
    text = p.read_text(encoding='utf-8')
    lines = text.splitlines()
    if has_h1(lines):
        return False
    # Check frontmatter
    if text.startswith('---'):
        idx = text.find('---', 3)
        if idx == -1:
            return False
        raw = text[3:idx]
        body = text[idx+3:]
        try:
            fm = yaml.safe_load(raw) or {}
            title = fm.get('title')
        except Exception:
            title = None
        if not title:
            # fallback to filename
            title = p.stem
        # Prepend H1 to body
        new_text = '---\n' + raw + '---\n' + f"# {title}\n\n" + body.lstrip('\n')
        p.write_text(new_text, encoding='utf-8')
        return True
    else:
        # no frontmatter; create with title from filename and add h1
        title = p.stem
        new_text = f"---\ntitle: {title}\ntags: ['uncategorized']\ncategory: misc\n---\n# {title}\n\n" + text
        p.write_text(new_text, encoding='utf-8')
        return True


def main():
    root = Path('docs')
    total = 0
    updated = 0
    for p in root.rglob('*.md'):
        total += 1
        try:
            if process_file(p):
                updated += 1
        except Exception:
            pass
    print(f"Added H1 to {updated}/{total} files")
    return 0


if __name__ == '__main__':
    sys.exit(main())
