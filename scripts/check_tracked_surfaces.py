#!/usr/bin/env python3
"""
Generated surfaces must reference files git will actually accept.

This is the gate for the defect that left `main` drifted for weeks: the
un-anchored `lib/` and `.vscode/` rules in .gitignore matched inside the
aggregated corpus, so the crawl wrote those pages to disk, the navigator
indexed them, the fact sheets counted them, and then the auto-commit
silently dropped them. The committed navigation pointed at pages that had
never been committed, and every branch cut from main failed the nav gate.

A build is only honest if what it publishes is what it commits, so this
checks three invariants:

  1. every page the navigation names is a git-tracked file
  2. nothing under docs/ is ignored by .gitignore
  3. each project's fact sheet counts the files git actually tracks

Usage:
    python3 scripts/check_tracked_surfaces.py [--json]

Exit codes: 0 = clean, 1 = a surface references something git will not keep.
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, List

import yaml

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
NAV_YML = ROOT / "nav.yml"
NAV_DIR = ROOT / "context" / "nav"
FACTS_DIR = ROOT / "context" / "facts"


def _git(*args: str) -> List[str]:
    done = subprocess.run(["git", "-C", str(ROOT), *args],
                          capture_output=True, text=True)
    if done.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)}: {done.stderr.strip()[:200]}")
    return [line for line in done.stdout.splitlines() if line]


def tracked_docs() -> set:
    return set(_git("ls-files", "docs"))


def nav_targets() -> List[str]:
    """Every page path in nav.yml, as docs-relative strings."""
    if not NAV_YML.is_file():
        return []
    data = yaml.safe_load(NAV_YML.read_text(encoding="utf-8")) or {}
    found: List[str] = []

    def walk(node) -> None:
        if isinstance(node, dict):
            for value in node.values():
                walk(value)
        elif isinstance(node, list):
            for item in node:
                walk(item)
        elif isinstance(node, str):
            found.append(node)

    walk(data.get("nav"))
    return found


def nav_tree_targets() -> List[str]:
    """Every page path in the frontend-agnostic navigation trees."""
    found: List[str] = []
    if not NAV_DIR.is_dir():
        return found

    def walk(node) -> None:
        if not isinstance(node, dict):
            return
        if node.get("type") == "page" and node.get("path"):
            found.append(node["path"])
        for child in node.get("children") or []:
            walk(child)

    for path in sorted(NAV_DIR.glob("*.json")):
        if path.name == "index.json":
            continue
        try:
            walk((json.loads(path.read_text(encoding="utf-8")) or {}).get("tree"))
        except (json.JSONDecodeError, OSError):
            continue
    return found


def check() -> Dict:
    tracked = tracked_docs()
    problems: List[Dict] = []

    # 1. the sidebar and the trees may only name files git keeps
    for surface, targets in (("nav.yml", nav_targets()),
                             ("context/nav/*.json", nav_tree_targets())):
        for target in sorted(set(targets)):
            if f"docs/{target}" not in tracked:
                problems.append({
                    "kind": "untracked-nav-target",
                    "surface": surface, "target": target,
                    "message": f"{surface} names `docs/{target}`, which git does not track",
                })

    # 2. nothing in the corpus may be ignored
    ignored = _git("ls-files", "--others", "--ignored", "--exclude-standard",
                   "--directory", "docs")
    for path in ignored:
        problems.append({
            "kind": "ignored-corpus-path", "surface": ".gitignore", "target": path,
            "message": f"`{path}` is in the corpus on disk but ignored by .gitignore",
        })

    # 3. fact sheets must count what git tracks
    for facts_path in sorted(FACTS_DIR.glob("*.json")) if FACTS_DIR.is_dir() else []:
        try:
            facts = json.loads(facts_path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            continue
        name = (facts.get("project") or {}).get("name") or facts_path.stem
        claimed = (facts.get("corpus") or {}).get("file_count")
        if claimed is None:
            continue
        actual = sum(1 for p in tracked
                     if p.startswith(f"docs/{name}/") and p.endswith(".md"))
        if claimed != actual:
            problems.append({
                "kind": "fact-count-mismatch", "surface": f"context/facts/{name}.json",
                "target": name,
                "message": f"{name} facts claim {claimed} documents, git tracks {actual}",
            })

    return {
        "tracked_docs": len(tracked),
        "nav_targets": len(set(nav_targets())),
        "problems": problems,
    }


def main(argv: List[str]) -> int:
    result = check()
    if "--json" in argv:
        print(json.dumps(result, indent=2))
    else:
        for problem in result["problems"]:
            print(f"error: {problem['message']}")
        print(f"check_tracked_surfaces: {result['tracked_docs']} tracked documents, "
              f"{result['nav_targets']} navigation targets, "
              f"{len(result['problems'])} problem(s)")
        if result["problems"]:
            print("\nA generated surface references something git will not keep. "
                  "Usually an over-broad .gitignore rule: anchor it to the "
                  "repository root, then rebuild.", file=sys.stderr)
    return 1 if result["problems"] else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
