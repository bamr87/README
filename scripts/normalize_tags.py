#!/usr/bin/env python3
"""Normalize tags in YAML frontmatter to lowercase and deduplicate."""
from pathlib import Path
import yaml
import sys


def normalize_tags_in_fm(fm: dict) -> bool:
    if 'tags' not in fm:
        return False
    tags = fm['tags']
    if not isinstance(tags, list):
        return False
    new_tags = []
    for t in tags:
        s = str(t).strip().lower()
        if s and s not in new_tags:
            new_tags.append(s)
    if new_tags != tags:
        fm['tags'] = new_tags
        return True
    return False


def process_file(p: Path):
    text = p.read_text(encoding='utf-8')
    if not text.startswith('---'):
        return False
    idx = text.find('---', 3)
    if idx == -1:
        return False
    raw = text[3:idx]
    body = text[idx+3:]
    try:
        fm = yaml.safe_load(raw) or {}
    except Exception:
        return False
    changed = normalize_tags_in_fm(fm)
    if changed:
        out = '---\n' + yaml.safe_dump(fm, sort_keys=False) + '---\n' + body.lstrip('\n')
        p.write_text(out, encoding='utf-8')
        return True
    return False


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
    print(f"Normalized tags in {updated}/{total} files")
    return 0


if __name__ == '__main__':
    sys.exit(main())
