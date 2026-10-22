"""
Fleet documentation survey: gather -> analyze -> report.

Reads the inventory in `_data/fleet.yml`, shallow-clones each repository,
runs every registered check over it, scores it, and writes one report:

    context/sources/<name>.json     per-repository manifest
    context/reports/fleet_health.json   findings and scores
    context/reports/fleet_health.md     the human twin

The survey never touches the docs/ corpus, the navigation surfaces or the
context pyramid - a repository can be surveyed without being aggregated.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional

import yaml

from . import ENGINE_VERSION
from .analyze import build_report, render_markdown, run_checks, score_repo
from .analyze.framework import inventory
from .analyze.review import build_review, render_review, sizes
from .config import CONTEXT_DIR, DATA_DIR, ROOT
from .gather import CACHE_DIR, gather_local, gather_repo

FLEET_PATH = DATA_DIR / "fleet.yml"
SOURCES_DIR = CONTEXT_DIR / "sources"
REPORTS_DIR = CONTEXT_DIR / "reports"
GITHUB_SNAPSHOT = SOURCES_DIR / "github.json"
REPORT_JSON = REPORTS_DIR / "fleet_health.json"
REPORT_MD = REPORTS_DIR / "fleet_health.md"
REVIEW_JSON = REPORTS_DIR / "docs_review.json"
REVIEW_MD = REPORTS_DIR / "docs_review.md"


class FleetError(ValueError):
    """The fleet inventory is missing or malformed."""


def load_fleet(path: Path = FLEET_PATH) -> List[Dict]:
    """The repositories to survey, with defaults applied."""
    if not path.is_file():
        raise FleetError(f"fleet inventory not found: {path}")
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    if not isinstance(data.get("repos"), list):
        raise FleetError("fleet inventory must carry a `repos` list")
    defaults = data.get("defaults") or {}
    entries: List[Dict] = []
    for raw in data["repos"]:
        if not isinstance(raw, dict):
            raise FleetError(f"repo entry must be a mapping: {raw!r}")
        entry = {**defaults, **raw}
        for field in ("name", "repo", "url"):
            if not entry.get(field):
                raise FleetError(f"repo entry missing `{field}`: {raw!r}")
            # A name like `1987` is a YAML integer until told otherwise.
            entry[field] = str(entry[field])
        entries.append(entry)
    return entries


def load_github_snapshot(path: Path = GITHUB_SNAPSHOT) -> Dict[str, Dict]:
    if not path.is_file():
        return {}
    try:
        return (json.loads(path.read_text(encoding="utf-8")) or {}).get("repos", {})
    except (json.JSONDecodeError, OSError):
        return {}


def survey(names: Optional[List[str]] = None, cache_dir: Path = CACHE_DIR,
           write: bool = True, progress: bool = True) -> Dict:
    """Run the full survey; returns the report."""
    entries = [e for e in load_fleet() if e.get("survey", True)]
    if names:
        wanted = set(names)
        entries = [e for e in entries if e["name"] in wanted]
        missing = wanted - {e["name"] for e in entries}
        if missing:
            raise FleetError(f"not in the fleet inventory (or not surveyed): "
                             f"{', '.join(sorted(missing))}")
    snapshot = load_github_snapshot()

    results: List[Dict] = []
    for i, entry in enumerate(entries, 1):
        name = entry["name"]
        source = gather_repo(name=name, repo=entry["repo"], url=entry["url"],
                             branch=entry.get("branch"),
                             meta=snapshot.get(name, {}), cache_dir=cache_dir)
        ctx = {
            "kind": entry.get("kind", "default"),
            "entry": entry,
            # Paths whose links are not this repository's to fix - an
            # aggregated or vendored copy of another repository's docs, whose
            # relative links resolved upstream and cannot resolve here.
            "link_exclude": tuple(entry.get("link_exclude") or ()),
        }
        findings = run_checks(source, ctx) if source.ok else []
        health = score_repo(findings) if source.ok else {}
        results.append({
            "name": name, "repo": entry["repo"], "url": entry["url"],
            "kind": ctx["kind"], "manifest": source.manifest(),
            "findings": findings, "health": health,
            "docs": inventory(source) if source.ok else [],
            "sizes": sizes(source) if source.ok else {},
        })
        if progress:
            if source.ok:
                errors = sum(1 for f in findings if f.severity == "error")
                warns = sum(1 for f in findings if f.severity == "warn")
                print(f"[{i:>2}/{len(entries)}] {name:<22} "
                      f"score {health['score']:>3} ({health['grade']})  "
                      f"{len(findings):>3} findings  {errors}E/{warns}W")
            else:
                print(f"[{i:>2}/{len(entries)}] {name:<22} FAILED: {source.error[:60]}")

    report = build_report(results)
    if write:
        write_report(report, results)
        write_review(build_review(results, "the default branch of every surveyed repository"))
    return report


def survey_local(path: Path, name: Optional[str] = None,
                 kind: Optional[str] = None) -> Dict:
    """Run the checks over one working tree, using its fleet entry when it has one."""
    path = Path(path).resolve()
    name = name or path.name
    entry = next((e for e in load_fleet() if e["name"] == name), None) or {}
    source = gather_local(path, name=name, repo=entry.get("repo", name),
                          url=entry.get("url", str(path)),
                          meta=load_github_snapshot().get(name, {}))
    ctx = {
        "kind": kind or entry.get("kind", "default"),
        "entry": entry,
        "link_exclude": tuple(entry.get("link_exclude") or ()),
    }
    findings = run_checks(source, ctx) if source.ok else []
    health = score_repo(findings) if source.ok else {}
    return build_report([{
        "name": name, "repo": entry.get("repo", name),
        "url": entry.get("url", str(path)), "kind": ctx["kind"],
        "manifest": source.manifest(), "findings": findings, "health": health,
    }])


def _origin_slug(path: Path) -> str:
    """`owner/name` of a checkout's origin remote, or "" when it has none."""
    import subprocess
    try:
        url = subprocess.run(["git", "-C", str(path), "remote", "get-url", "origin"],
                             capture_output=True, text=True, timeout=30).stdout.strip()
    except (OSError, subprocess.TimeoutExpired):
        return ""
    url = url[:-4] if url.endswith(".git") else url
    parts = url.replace(":", "/").rstrip("/").split("/")
    return "/".join(parts[-2:]) if len(parts) >= 2 else ""


def survey_workspace(root: Path, names: Optional[List[str]] = None, write: bool = True,
                     progress: bool = True) -> Dict:
    """
    Review every checkout under `root` - the fleet's working trees, on whatever
    branch each is on - and write the consolidated documentation review.

    A checkout is matched to its fleet entry by origin slug, then by directory
    name; one the inventory does not know is reviewed under its directory name
    with the default profile. Only `docs_review.*` is written: `fleet_health`
    stays the record of the default branches, which a workspace is not.
    """
    root = Path(root).resolve()
    fleet = load_fleet()
    by_repo = {e["repo"].lower(): e for e in fleet}
    by_name = {e["name"]: e for e in fleet}
    snapshot = load_github_snapshot()
    checkouts = [p for p in sorted(root.iterdir(), key=lambda p: p.name.lower())
                 if (p / ".git").exists()]
    results: List[Dict] = []
    for i, path in enumerate(checkouts, 1):
        slug = _origin_slug(path)
        entry = by_repo.get(slug.lower()) or by_name.get(path.name) or {}
        name = entry.get("name") or path.name
        if any(r["name"] == name for r in results):  # a second worktree of one repo
            name = path.name
        if names and name not in names and path.name not in names:
            continue
        source = gather_local(path, name=name, repo=entry.get("repo") or slug or name,
                              url=entry.get("url") or (f"https://github.com/{slug}" if slug else str(path)),
                              meta=snapshot.get(name, {}))
        ctx = {"kind": entry.get("kind", "default"), "entry": entry,
               "link_exclude": tuple(entry.get("link_exclude") or ())}
        findings = run_checks(source, ctx) if source.ok else []
        results.append({
            "name": name, "repo": source.repo, "url": source.url, "kind": ctx["kind"],
            "manifest": source.manifest(), "findings": findings,
            "health": score_repo(findings) if source.ok else {},
            "docs": inventory(source) if source.ok else [], "sizes": sizes(source) if source.ok else {},
        })
        if progress:
            bad = sum(1 for f in findings if f.check.startswith("DOC-") and f.severity != "info")
            print(f"[{i:>2}/{len(checkouts)}] {name:<22} {source.default_branch or '-':<28} "
                  f"{len(results[-1]['docs']):>4} docs  {bad} framework finding(s)")
    review = build_review(results, "local working trees (each on the branch shown)")
    if write:
        write_review(review)
    return review


def write_review(review: Dict) -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    REVIEW_JSON.write_text(json.dumps(review, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    REVIEW_MD.write_text(render_review(review), encoding="utf-8")


def summarize_review(review: Dict) -> str:
    s = review["summary"]
    lines = [f"docs review: {s['repositories']} repositories, {s['documents']} documents, "
             f"{s['conformant']} meet every framework row"]
    for row, count in s["failing_by_row"].items():
        lines.append(f"  {row:<7} failing in {count}")
    return "\n".join(lines)


def write_report(report: Dict, results: List[Dict]) -> None:
    SOURCES_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    for result in results:
        path = SOURCES_DIR / f"{result['name']}.json"
        path.write_text(json.dumps(result["manifest"], indent=2) + "\n",
                        encoding="utf-8")
    REPORT_JSON.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    REPORT_MD.write_text(render_markdown(report), encoding="utf-8")


def summarize(report: Dict) -> str:
    """One screen for a human."""
    summary = report["summary"]
    lines = [
        f"fleet survey: {summary['repositories']} repositories, "
        f"{summary['findings']} findings, mean health {summary['mean_score']}",
        f"  {summary['by_severity'].get('error', 0)} error / "
        f"{summary['by_severity'].get('warn', 0)} warn / "
        f"{summary['by_severity'].get('info', 0)} info",
        "",
        f"{'repository':<24}{'score':>6}  grade  findings",
    ]
    for name in report["ranking"]:
        entry = report["repositories"][name]
        health = entry.get("health") or {}
        lines.append(f"{name:<24}{health.get('score', 0):>6}  "
                     f"{health.get('grade', '-'):^5}  {len(entry['findings'])}")
    return "\n".join(lines)
