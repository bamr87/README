#!/usr/bin/env python3
"""Run doc checks and generate a JSON report artifact for CI upload."""
import subprocess
import json
import re
from pathlib import Path
from collections import defaultdict


def run(cmd):
    p = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return p.returncode, p.stdout, p.stderr


def parse_lint_output(out: str):
    m = re.search(r"Checked (\d+) files; found (\d+) issues", out)
    if m:
        return int(m.group(1)), int(m.group(2))
    # fallback
    return None, None


def parse_frontmatter_output(out: str):
    m = re.search(r"Checked (\d+) files, updated (\d+) files", out)
    if m:
        return int(m.group(1)), int(m.group(2))
    return None, None


def main():
    # run lint
    lint_code, lint_out, lint_err = run("python3 scripts/lint_docs.py")
    files_checked, issues_found = parse_lint_output(lint_out + lint_err)

    # parse lint output for file-specific counts
    file_counts = defaultdict(int)
    for line in (lint_out + lint_err).splitlines():
        # lines like: docs/.../file.md 12: Line too long  or "  -: Missing H1 heading"
        m = re.match(r"^(.*\.md)\s+(\d+|\-):", line)
        if m:
            file_counts[m.group(1).strip()] += 1

    # top N files
    top_files = sorted(file_counts.items(), key=lambda x: x[1], reverse=True)[:20]

    # run frontmatter check
    fm_code, fm_out, fm_err = run("python3 scripts/check_frontmatter.py")
    fm_checked, fm_updated = parse_frontmatter_output(fm_out + fm_err)

    # whitespace fixer dry run: we don't run fixer here; instead we count trailing whitespace occurrences using git grep maybe
    # run a simple grep to estimate trailing whitespace occurrences
    ws_count = 0
    try:
        _rc, stdout, stderr = run("grep -RIn --exclude-dir=.git -E '\\s+$' docs | wc -l")
        ws_count = int(stdout.strip()) if stdout.strip() else 0
    except Exception:
        ws_count = 0

    report = {
        "lint": {
            "files_checked": files_checked,
            "issues_found": issues_found,
            "exit_code": lint_code
        },
        "frontmatter": {
            "files_checked": fm_checked,
            "files_updated": fm_updated,
            "exit_code": fm_code
        },
        "whitespace_issues": ws_count
    ,
        "top_issues": top_files
    }

    out_dir = Path('docs/results')
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / 'docs_quality_report.json'
    out_path.write_text(json.dumps(report, indent=2))
    print(f"Wrote report to {out_path}")
    print(json.dumps(report, indent=2))
    return 0


if __name__ == '__main__':
    import sys
    sys.exit(main())
