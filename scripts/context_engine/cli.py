"""Command-line interface for the context engine."""

import argparse
import json
import sys
from typing import List

from . import ENGINE_VERSION
from .builder import build_all
from .navigator import check_nav
from .query import (
    ContextMissing, get_apex, get_card, get_facts, get_manifest, get_nav,
    list_nav, list_projects, search,
)
from .registry import RegistryError, load_registry, sync_repos_txt


def _cmd_build(args: argparse.Namespace) -> int:
    summary = build_all(
        ai_spec=args.ai,
        run_stage_hooks=not args.no_hooks,
        update_readme=not args.no_readme,
        update_site_index=not args.no_site_index,
    )
    print(f"[done] {summary['projects']} projects, {summary['terms']} terms, "
          f"enrichment={summary['enrichment']}")
    return 0


def _cmd_sync(_args: argparse.Namespace) -> int:
    changed = sync_repos_txt(load_registry())
    print("repos.txt regenerated" if changed else "repos.txt already up to date")
    return 0


def _cmd_query(args: argparse.Namespace) -> int:
    results = search(args.terms, limit=args.limit)
    if args.json:
        print(json.dumps(results, indent=2))
        return 0
    if not results:
        print("no matches in the context layer")
        return 1
    for result in results:
        location = result["path"] or result["id"]
        print(f"{result['score']:>4}  {result['type']:<5} {location}")
        if result.get("summary"):
            print(f"      {result['summary'][:120]}")
        for doc in result.get("key_docs", [])[:3]:
            print(f"      -> {doc}")
    return 0


def _cmd_card(args: argparse.Namespace) -> int:
    print(get_card(args.name))
    return 0


def _cmd_facts(args: argparse.Namespace) -> int:
    print(json.dumps(get_facts(args.name), indent=2, sort_keys=True))
    return 0


def _print_nav(nodes, depth: int, limit: int, prefix: str = "") -> None:
    for node in nodes:
        marker = "-" if node["type"] == "page" else "+"
        target = node.get("path") or node.get("index") or ""
        count = "" if node["type"] == "page" else f"  ({node.get('pages', 0)} pages)"
        print(f"{prefix}{marker} {node['title']}{count}"
              + (f"    {target}" if target else ""))
        if node["type"] != "page" and depth < limit:
            _print_nav(node.get("children") or [], depth + 1, limit, prefix + "  ")


def _cmd_nav(args: argparse.Namespace) -> int:
    if args.name is None:
        rows = list_nav()
        if args.json:
            print(json.dumps(rows, indent=2))
            return 0
        for row in rows:
            flag = "" if row.get("registered", True) else "  (unregistered)"
            print(f"{row['name']:<24} {row['pages']:>5} pages  "
                  f"{row['sections']:>4} sections  depth {row['max_depth']}{flag}")
        return 0
    nav = get_nav(args.name)
    if args.json:
        print(json.dumps(nav, indent=2))
        return 0
    counts = nav["counts"]
    print(f"{nav['title']}  —  {counts['pages']} pages, "
          f"{counts['sections']} sections, depth {counts['max_depth']}")
    print(f"corpus: {nav['corpus']}  fingerprint: {nav['fingerprint']}\n")
    _print_nav(nav["tree"].get("children") or [], 1, args.depth)
    return 0


def _cmd_navcheck(_args: argparse.Namespace) -> int:
    drifted = check_nav(load_registry())
    if not drifted:
        print("navigation surfaces are in sync with the corpus")
        return 0
    print("navigation drift detected — run "
          "`python3 -m scripts.context_engine build`:", file=sys.stderr)
    for entry in drifted:
        print(f"  {entry}", file=sys.stderr)
    return 1


def _cmd_apex(_args: argparse.Namespace) -> int:
    print(get_apex())
    return 0


def _cmd_status(_args: argparse.Namespace) -> int:
    manifest = get_manifest()
    print(json.dumps(manifest, indent=2))
    return 0


def _cmd_projects(args: argparse.Namespace) -> int:
    projects = list_projects()
    if args.json:
        print(json.dumps(projects, indent=2))
        return 0
    for project in projects:
        print(f"{project['name']:<24} {project['kind']:<8} {project['status']:<10} "
              f"{project['corpus_files']:>5} docs  {project['repo']}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="python3 -m scripts.context_engine",
        description=f"README context engine v{ENGINE_VERSION} - build and "
                    "query the fleet context pyramid",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    build = sub.add_parser("build", help="run the full pipeline")
    build.add_argument("--ai", default="auto",
                       choices=["auto", "off", "anthropic", "xai", "mock"],
                       help="AI enrichment provider (default: auto-detect from env)")
    build.add_argument("--no-hooks", action="store_true", help="skip hooks.d/ hooks")
    build.add_argument("--no-readme", action="store_true",
                       help="don't rewrite the root README AUTO span")
    build.add_argument("--no-site-index", action="store_true",
                       help="don't rewrite docs/index.md")
    build.set_defaults(func=_cmd_build)

    sync = sub.add_parser("sync", help="regenerate repos.txt from _data/projects.yml")
    sync.set_defaults(func=_cmd_sync)

    query = sub.add_parser("query", help="search the context layer")
    query.add_argument("terms", nargs="+")
    query.add_argument("--limit", type=int, default=10)
    query.add_argument("--json", action="store_true")
    query.set_defaults(func=_cmd_query)

    card = sub.add_parser("card", help="print a project card")
    card.add_argument("name")
    card.set_defaults(func=_cmd_card)

    facts = sub.add_parser("facts", help="print a project fact sheet")
    facts.add_argument("name")
    facts.set_defaults(func=_cmd_facts)

    nav = sub.add_parser("nav", help="print a navigation tree (or list corpora)")
    nav.add_argument("name", nargs="?", help="corpus name (omit to list all)")
    nav.add_argument("--depth", type=int, default=2,
                     help="section levels to print (default: 2)")
    nav.add_argument("--json", action="store_true")
    nav.set_defaults(func=_cmd_nav)

    navcheck = sub.add_parser(
        "navcheck", help="fail when the generated navigation is out of sync")
    navcheck.set_defaults(func=_cmd_navcheck)

    apex = sub.add_parser("apex", help="print the consolidated README")
    apex.set_defaults(func=_cmd_apex)

    status = sub.add_parser("status", help="print the freshness manifest")
    status.set_defaults(func=_cmd_status)

    projects = sub.add_parser("projects", help="list fleet projects")
    projects.add_argument("--json", action="store_true")
    projects.set_defaults(func=_cmd_projects)

    return parser


def main(argv: List[str]) -> int:
    args = build_parser().parse_args(argv)
    try:
        return args.func(args)
    except (ContextMissing, RegistryError, ValueError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
