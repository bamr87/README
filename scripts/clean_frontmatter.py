#!/usr/bin/env python3
"""Utility that normalizes frontmatter in docs to a compact canonical form."""
from pathlib import Path
import yaml


def normalize_fm(fm: dict) -> dict:
    out = {}
    # keep some common fields only and order them
    for k in ['title', 'category', 'tags', 'last_updated', 'source_file']:
        if k in fm:
            out[k] = fm[k]
    return out


def main():
    root = Path('docs')
    for p in root.rglob('*.md'):
        text = p.read_text(encoding='utf-8')
        if text.startswith('---'):
            idx = text.find('---', 3)
            if idx != -1:
                raw = text[3:idx]
                body = text[idx+3:]
                fm = yaml.safe_load(raw) or {}
                new_fm = normalize_fm(fm)
                out = '---\n' + yaml.dump(new_fm, sort_keys=False) + '---\n' + body.lstrip('\n')
                p.write_text(out, encoding='utf-8')


if __name__ == '__main__':
    main()
