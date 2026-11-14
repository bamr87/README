"""Command-line interface for the context engine."""

import argparse
from pathlib import Path
import json
import sys
from typing import List

from . import ENGINE_VERSION
from .brain import save_note
from .builder import build_all
from .collect import collect
from .navigator import check_nav
from .query import (
    ContextMissing, get_apex, get_card, get_facts, get_hot, get_manifest, get_nav,
    get_neighbours, get_note, list_nav, list_projects, search, vault_lint,
)
from .registry import RegistryError, load_registry, sync_repos_txt
from .survey import (FleetError, load_fleet, summarize, summarize_review, survey,
                     survey_local, survey_workspace)


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


def _cmd_collect(args: argparse.Namespace) -> int:
    workspace = Path(args.workspace).expanduser() if args.workspace else None
    entries = collect(load_registry(), names=args.repo or None, workspace=workspace)
    print(f"[done] {len(entries)} projects, "
          f"{sum(e['pages'] for e in entries.values())} pages")
    return 0


def _cmd_note(args: argparse.Namespace) -> int:
    note = get_note(args.target)
    if note is None:
        print(f"no note matches {args.target!r}", file=sys.stderr)
        return 1
    if args.json:
        print(json.dumps(note, indent=2, ensure_ascii=False))
        return 0
    print(f"{note['title']}  ({note['path']})\n{note['summary']}\n")
    print(f"backlinks ({len(note['backlinks'])}):")
    for row in note["backlinks"][:args.limit]:
        print(f"  <- {row['path']}")
    print(f"links ({len(note['links'])}):")
    for row in note["links"][:args.limit]:
        print(f"  -> {row['path']}")
    return 0


def _cmd_neighbours(args: argparse.Namespace) -> int:
    rows = get_neighbours(args.target, depth=args.depth)
    if args.json:
        print(json.dumps(rows, indent=2, ensure_ascii=False))
        return 0
    for row in rows[:args.limit]:
        print(f"{row['distance']}  {row['path']}")
    return 0 if rows else 1


def _cmd_hot(_args: argparse.Namespace) -> int:
    print(get_hot())
    return 0


def _cmd_lint(args: argparse.Namespace) -> int:
    report = vault_lint()
    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        counts = report["counts"]
        print(f"{counts['notes']} notes, {counts['edges']} links, "
              f"{report['orphans']} orphans, {counts['unresolved']} unresolved targets")
        for row in report["unresolved"][:20]:
            print(f"  {row['pages']:>4}  {row['target']}  (e.g. {row['example']})")
    return 1 if args.strict and report["counts"]["unresolved"] else 0


def _cmd_save(args: argparse.Namespace) -> int:
    body = sys.stdin.read() if args.body == "-" else args.body
    path = save_note(args.title, body, tags=args.tag, sources=args.source)
    print(f"wrote {path.name} - run `python3 -m scripts.context_engine build` to publish it")
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


def _cmd_survey(args: argparse.Namespace) -> int:
    if args.workspace:
        review = survey_workspace(Path(args.workspace), names=args.repo or None,
                                  write=not args.no_write, progress=not args.json)
        if args.json:
            print(json.dumps(review, indent=2, ensure_ascii=False))
            return 0
        print()
        print(summarize_review(review))
        if not args.no_write:
            print("\nwrote context/reports/docs_review.json and .md")
        return 0
    if args.local:
        report = survey_local(args.local, name=args.name, kind=args.kind)
        if args.json:
            print(json.dumps(report, indent=2))
            return 0
        print(summarize(report))
        name = report["ranking"][0]
        for finding in report["repositories"][name]["findings"]:
            if finding["severity"] in ("error", "warn"):
                print(f"  [{finding['severity']}] {finding['check']} {finding['message']}")
        return 0
    report = survey(names=args.repo or None, write=not args.no_write,
                    progress=not args.json)
    if args.json:
        print(json.dumps(report, indent=2))
        return 0
    print()
    print(summarize(report))
    if not args.no_write:
        print("\nwrote context/reports/fleet_health.json and .md")
    return 0


def _cmd_fleet(args: argparse.Namespace) -> int:
    entries = load_fleet()
    if args.json:
        print(json.dumps(entries, indent=2))
        return 0
    for entry in entries:
        flag = "" if entry.get("survey", True) else "   (not surveyed)"
        print(f"{entry['name']:<24} {entry.get('kind', 'default'):<10} "
              f"{entry['repo']}{flag}")
    print(f"\n{len(entries)} repositories, "
          f"{sum(1 for e in entries if e.get('survey', True))} surveyed")
    return 0


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

    collect_cmd = sub.add_parser(
        "collect", help="crawl the registry's repositories into docs/")
    collect_cmd.add_argument("repo", nargs="*",
                             help="project names (default: every aggregated project)")
    collect_cmd.add_argument("--workspace", metavar="DIR",
                             help="read local checkouts under DIR where they exist "
                                  "instead of cloning")
    collect_cmd.set_defaults(func=_cmd_collect)

    note = sub.add_parser("note", help="read a note with its backlinks and links")
    note.add_argument("target", help="a path, title or alias, as in a [[wikilink]]")
    note.add_argument("--limit", type=int, default=20)
    note.add_argument("--json", action="store_true")
    note.set_defaults(func=_cmd_note)

    neighbours = sub.add_parser("neighbours", help="notes within N links of a note")
    neighbours.add_argument("target")
    neighbours.add_argument("--depth", type=int, default=1)
    neighbours.add_argument("--limit", type=int, default=50)
    neighbours.add_argument("--json", action="store_true")
    neighbours.set_defaults(func=_cmd_neighbours)

    hot = sub.add_parser("hot", help="print the hot cache: what changed, what connects")
    hot.set_defaults(func=_cmd_hot)

    lint = sub.add_parser("lint", help="report unresolved links and orphan notes")
    lint.add_argument("--strict", action="store_true",
                      help="exit 1 when any link is unresolved")
    lint.add_argument("--json", action="store_true")
    lint.set_defaults(func=_cmd_lint)

    save = sub.add_parser("save", help="file a durable note under notes/")
    save.add_argument("title")
    save.add_argument("body", help="note text, or - to read it from stdin")
    save.add_argument("--tag", action="append", help="repeatable")
    save.add_argument("--source", action="append",
                      help="a note this draws on, as a wikilink target; repeatable")
    save.set_defaults(func=_cmd_save)

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

    survey_cmd = sub.add_parser(
        "survey", help="survey the fleet's documentation health (_data/fleet.yml)")
    survey_cmd.add_argument("repo", nargs="*",
                            help="repository names (default: the whole fleet)")
    survey_cmd.add_argument("--json", action="store_true")
    survey_cmd.add_argument("--no-write", action="store_true",
                            help="report to stdout without writing context/")
    survey_cmd.add_argument("--local", metavar="PATH",
                            help="check a working tree instead of cloning "
                                 "(see a change's effect before pushing)")
    survey_cmd.add_argument("--workspace", metavar="DIR",
                            help="review every checkout under DIR (each on its current branch) "
                                 "and write context/reports/docs_review.{json,md}")
    survey_cmd.add_argument("--name", help="fleet name of a --local tree")
    survey_cmd.add_argument("--kind", help="override the governance profile")
    survey_cmd.set_defaults(func=_cmd_survey)

    fleet = sub.add_parser("fleet", help="list the fleet inventory (_data/fleet.yml)")
    fleet.add_argument("--json", action="store_true")
    fleet.set_defaults(func=_cmd_fleet)

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
    except (ContextMissing, RegistryError, FleetError, ValueError, RuntimeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
