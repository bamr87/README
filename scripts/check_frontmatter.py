#!/usr/bin/env python3
"""Check YAML frontmatter for markdown files under docs/.

Usage: python scripts/check_frontmatter.py [--fix] [--quiet]
"""
import os
import re
import sys
from pathlib import Path
import yaml
from datetime import datetime


def parse_frontmatter(content: str):
    if content.startswith("---"):
        # find second '---' after start
        idx = content.find("---", 3)
        if idx != -1:
            return content[3:idx], content[idx+3:]
    return None, content


def check_file(path: Path, fix=False):
    text = path.read_text(encoding="utf-8")
    raw_fm, body = parse_frontmatter(text)
    changed = False
    issues = []
    fm = {}
    if raw_fm is None:
        issues.append("Missing frontmatter")
        fm = {}
    else:
        try:
            fm = yaml.safe_load(raw_fm) or {}
        except Exception as e:
            issues.append(f"Invalid YAML: {e}")
            fm = {}

    # required fields
    required = ["title", "tags", "category"]
    for k in required:
        if k not in fm:
            issues.append(f"Missing field: {k}")
            if fix:
                # set a default title from filename
                if k == "title":
                    fm[k] = path.stem
                elif k == "tags":
                    fm[k] = ["uncategorized"]
                elif k == "category":
                    fm[k] = "misc"
                changed = True

    # tags normalization
    if "tags" in fm and isinstance(fm["tags"], list):
        norm = [str(t).strip().lower() for t in fm["tags"]]
        if norm != fm["tags"]:
            issues.append("Normalized tags to lower-case")
            if fix:
                fm["tags"] = norm
                changed = True

    # last_updated handling
    if "last_updated" not in fm and fix:
        fm["last_updated"] = None
        changed = True

    if fix and changed:
        out = ["---\n", yaml.safe_dump(fm, sort_keys=False), "---\n"]
        out.append(body.lstrip('\n'))
        path.write_text("".join(out), encoding="utf-8")

    return issues, changed


def main():
    root = Path("docs")
    quiet = False
    fix = False
    if "--fix" in sys.argv:
        fix = True
    if "--quiet" in sys.argv:
        quiet = True
    total = 0
    updated = 0
    files_issues = {}
    for p in root.rglob("*.md"):
        total += 1
        issues, changed = check_file(p, fix=fix)
        if issues:
            files_issues[str(p)] = issues
        if changed:
            updated += 1
    # print summary
    if not quiet:
        print(f"Checked {total} files, updated {updated} files.")
        for f, issues in files_issues.items():
            print(f"== {f} ==")
            for i in issues:
                print(f" - {i}")
    if files_issues:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
