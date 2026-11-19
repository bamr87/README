"""
Read-side API over the committed context tree.

Used by both the CLI (`python3 -m scripts.context_engine query ...`) and
the MCP server (mcp/server.py). Purely read-only: it never rebuilds.
"""

import json
import re
from pathlib import Path
from typing import Dict, FrozenSet, List, Optional, Tuple

from .config import (
    APEX_PATH, BRAIN_DIR, CARDS_DIR, CONTEXT_INDEX_PATH, DOCS_DIR,
    DOCS_INDEX_PATH, FACTS_DIR, GRAPH_PATH, MANIFEST_PATH, NAV_DIR,
    NAV_FLEET_PATH, ROOT, SECRET_SCREEN_PATH, SOURCES_DIR,
)
from .vault import Resolver, notes_from_graph

# get_doc returns at most this many characters of a page body by default.
DOC_MAX_CHARS = 20000

# A leading YAML front matter block: `---` lines around it, the corpus contract.
_FRONT_MATTER = re.compile(r"\A---[ \t]*\r?\n(?:.*?\r?\n)?---[ \t]*(?:\r?\n|\Z)",
                           re.DOTALL)

# docs_index.json path set, keyed by (index path, mtime, size) so a rebuild
# while the MCP server runs is picked up without re-reading on every call.
_DOC_PATHS_CACHE: Dict[Tuple[str, int, int], FrozenSet[str]] = {}


class ContextMissing(RuntimeError):
    """The context tree has not been built yet."""


def _require(path: Path,
             fix: str = "python3 -m scripts.context_engine build") -> Path:
    if not path.is_file():
        # Never put an absolute path in the message: it can reach MCP clients.
        shown = path.relative_to(ROOT) if path.is_relative_to(ROOT) else path.name
        raise ContextMissing(f"{shown} not found - run `{fix}` first")
    return path


def _confined(base: Path, name: str, suffix: str) -> Path:
    """
    `base/<name><suffix>`, refusing any name that is not a plain file stem
    or that resolves outside `base` (relative segments, absolute paths,
    symlinks). The refusal names neither the base nor the resolved path.
    """
    name = str(name or "")
    candidate = base / f"{name}{suffix}"
    if (not name or name in (".", "..") or "/" in name or "\\" in name
            or "\0" in name
            or not candidate.resolve().is_relative_to(base.resolve())):
        raise ContextMissing("unknown name: expected a plain project name")
    return candidate


def load_index() -> Dict:
    return json.loads(_require(CONTEXT_INDEX_PATH).read_text(encoding="utf-8"))


def get_apex() -> str:
    return _require(APEX_PATH).read_text(encoding="utf-8")


def get_card(name: str) -> str:
    return _require(_confined(CARDS_DIR, name, ".md")).read_text(encoding="utf-8")


def get_facts(name: str) -> Dict:
    return json.loads(_require(_confined(FACTS_DIR, name, ".json")).read_text(encoding="utf-8"))


def get_nav(name: Optional[str] = None) -> Dict:
    """Navigation tree for one corpus, or the fleet navigation manifest."""
    path = NAV_FLEET_PATH if not name else _confined(NAV_DIR, name, ".json")
    return json.loads(_require(path).read_text(encoding="utf-8"))


def list_nav(index: Optional[Dict] = None) -> List[Dict]:
    """Every navigable corpus with its page/section counts, in sidebar order."""
    fleet = get_nav()
    projects = fleet.get("projects", {})
    ordered = [n for n in fleet.get("order", []) if n in projects]
    ordered += [n for n in projects if n not in ordered]
    return [{"name": name, **projects[name]} for name in ordered]


def nav_paths(node: Dict, out: Optional[List[Dict]] = None,
              trail: Optional[List[str]] = None) -> List[Dict]:
    """Flatten a navigation tree into `{path, title, breadcrumb}` rows."""
    out = [] if out is None else out
    trail = trail or []
    for child in node.get("children") or []:
        if child.get("type") == "page":
            out.append({"path": child.get("path"), "title": child.get("title"),
                        "breadcrumb": trail + [child.get("title", "")]})
        else:
            nav_paths(child, out, trail + [child.get("title", "")])
    return out


def doc_paths() -> FrozenSet[str]:
    """Every page path listed in docs/docs_index.json, relative to docs/."""
    index_path = _require(DOCS_INDEX_PATH, fix="python3 scripts/generate_docs_index.py")
    stat = index_path.stat()
    key = (str(index_path), stat.st_mtime_ns, stat.st_size)
    paths = _DOC_PATHS_CACHE.get(key)
    if paths is None:
        index = json.loads(index_path.read_text(encoding="utf-8"))
        paths = frozenset(
            doc["path"] for doc in index.get("documents", [])
            if isinstance(doc, dict) and isinstance(doc.get("path"), str))
        _DOC_PATHS_CACHE.clear()
        _DOC_PATHS_CACHE[key] = paths
    return paths


def _indexed_doc(path: str) -> Path:
    """
    The file under docs/ for an indexed page path, or ContextMissing.

    Accepts the path as get_nav and search_context give it (`<project>/...`,
    or `docs/<project>/...` from key_docs). Anything not listed in
    docs/docs_index.json, or resolving outside docs/ (a symlink), is refused
    before the file is opened; the refusal never echoes a filesystem path.
    """
    rel = str(path or "").strip()
    if rel.startswith("docs/"):
        rel = rel[len("docs/"):]
    candidate = DOCS_DIR / rel
    if (not rel or rel not in doc_paths()
            or not candidate.resolve().is_relative_to(DOCS_DIR.resolve())):
        raise ContextMissing(
            "unknown document: pass a page path listed in docs/docs_index.json "
            "(get_nav with flat=true, or search_context key_docs)")
    # Listed but gone: the index is older than the corpus.
    return _require(candidate, fix="python3 scripts/generate_docs_index.py")


def get_doc(path: str, max_chars: int = DOC_MAX_CHARS) -> Dict:
    """
    One indexed corpus page: its body without front matter, capped at
    `max_chars` with an explicit truncation note, plus where it comes from.

    `project` and `repo` are the registry project the page was aggregated
    from (the first path segment), or None for this repository's own pages.
    """
    target = _indexed_doc(path)
    rel = target.relative_to(DOCS_DIR).as_posix()
    body = _FRONT_MATTER.sub("", target.read_text(encoding="utf-8", errors="replace"),
                             count=1).lstrip("\r\n")
    total = len(body)
    limit = max(1, int(max_chars))
    truncated = total > limit
    if truncated:
        body = (body[:limit].rstrip()
                + f"\n\n[truncated: {limit} of {total} characters]")
    try:
        projects = load_index().get("projects", {})
    except ContextMissing:
        projects = {}
    segment = rel.split("/", 1)[0] if "/" in rel else ""
    info = projects.get(segment)
    return {
        "project": segment if info is not None else None,
        "repo": (info or {}).get("repo"),
        "path": f"docs/{rel}",
        "chars": total,
        "truncated": truncated,
        "text": body,
    }


def get_manifest() -> Dict:
    return json.loads(_require(MANIFEST_PATH).read_text(encoding="utf-8"))


# Provenance trust markers (README-011): text an upstream repository wrote,
# versus text this engine wrote itself.
TRUST_UPSTREAM = "untrusted-third-party"
TRUST_ENGINE = "first-party"


def _json_or_empty(path: Path) -> Dict:
    """A JSON object from `path`, or {} when it is absent or unreadable."""
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}
    return data if isinstance(data, dict) else {}


def get_source(name: str) -> Dict:
    """
    `context/sources/<name>.json` (repo, head.sha, fingerprint), confined like
    every other per-project read; {} when the survey has not written it.
    """
    try:
        path = _confined(SOURCES_DIR, name, ".json")
    except ContextMissing:
        return {}
    return _json_or_empty(path)


def project_enrichment(name: str, manifest: Dict) -> Optional[str]:
    """
    How a project's card was enriched: the manifest's per-project record
    (`heuristic`, `ai:<provider>` or `quarantined`), else the build-wide mode
    a manifest older than that record carries.
    """
    return ((manifest.get("project_enrichment") or {}).get(name)
            or manifest.get("enrichment"))


def provenance(project: Optional[str], path: str,
               manifest: Optional[Dict] = None,
               index: Optional[Dict] = None) -> Dict:
    """
    Where an answer comes from: always the six keys `source`, `repo`,
    `commit`, `path`, `enrichment`, `trust`.

    With a `project`, the content is derived from that upstream repository:
    `commit` is its surveyed head SHA, else its corpus fingerprint, and
    `trust` is untrusted-third-party. Without one, the engine wrote it.
    """
    if manifest is None:
        manifest = _json_or_empty(MANIFEST_PATH)
    if not project:
        return {"source": "engine", "repo": None, "commit": None, "path": path,
                "enrichment": manifest.get("enrichment"), "trust": TRUST_ENGINE}
    if index is None:
        index = _json_or_empty(CONTEXT_INDEX_PATH)
    source = get_source(project)
    info = (index.get("projects") or {}).get(project) or {}
    head = source.get("head") if isinstance(source.get("head"), dict) else {}
    return {
        "source": "upstream",
        "repo": source.get("repo") or info.get("repo"),
        "commit": (head.get("sha") or source.get("fingerprint")
                   or info.get("fingerprint")
                   or (manifest.get("fingerprints") or {}).get(project)),
        "path": path,
        "enrichment": project_enrichment(project, manifest),
        "trust": TRUST_UPSTREAM,
    }


def with_provenance(results: List[Dict], manifest: Optional[Dict] = None,
                    index: Optional[Dict] = None) -> List[Dict]:
    """Search rows, each with the provenance of the document it points at."""
    if manifest is None:
        manifest = _json_or_empty(MANIFEST_PATH)
    if index is None:
        index = _json_or_empty(CONTEXT_INDEX_PATH)
    return [{**row, "provenance": provenance(row.get("project"),
                                             row.get("path") or row.get("id"),
                                             manifest, index)}
            for row in results]


def project_status(manifest: Optional[Dict] = None) -> Dict[str, Dict]:
    """
    Per project: its enrichment mode and its screen result.

    `screen.status` is `quarantined` (with the injection screen's `q4_hits`)
    or `clean` when the manifest carries the per-project record that only a
    screening build writes, with `redactions`, the credentials collect's
    secret screen redacted; an older manifest gives `not screened`.
    """
    manifest = get_manifest() if manifest is None else manifest
    per_project = manifest.get("project_enrichment")
    quarantined = manifest.get("quarantined") or {}
    redactions: Dict[str, int] = {}
    for hit in _json_or_empty(SECRET_SCREEN_PATH).get("hits") or []:
        if isinstance(hit, dict) and hit.get("project"):
            redactions[hit["project"]] = redactions.get(hit["project"], 0) + 1
    names = sorted(set(manifest.get("fingerprints") or {}) | set(per_project or {}))
    status: Dict[str, Dict] = {}
    for name in names:
        if per_project is None:
            screen: Dict = {"status": "not screened"}
        else:
            hits = list(quarantined.get(name) or [])
            screen = {"status": "quarantined" if hits else "clean",
                      "q4_hits": hits, "redactions": redactions.get(name, 0)}
        status[name] = {"enrichment": project_enrichment(name, manifest),
                        "screen": screen}
    return status


def list_projects(index: Optional[Dict] = None) -> List[Dict]:
    index = index or load_index()
    return [
        {"name": name, **info}
        for name, info in sorted(index.get("projects", {}).items())
    ]


def search(terms: List[str], index: Optional[Dict] = None, limit: int = 10) -> List[Dict]:
    """Rank context documents by summed term frequency across query terms."""
    index = index or load_index()
    term_index = index.get("terms", {})
    documents = {doc["id"]: doc for doc in index.get("documents", [])}

    scores: Dict[str, int] = {}
    matched: Dict[str, set] = {}
    for raw in terms:
        token = raw.lower().strip()
        if not token:
            continue
        # exact hit plus cheap prefix expansion
        candidates = [token] if token in term_index else []
        candidates += [t for t in term_index if t.startswith(token) and t != token][:20]
        for candidate in candidates:
            for doc_id, count in term_index[candidate].items():
                weight = count * (2 if candidate == token else 1)
                scores[doc_id] = scores.get(doc_id, 0) + weight
                matched.setdefault(doc_id, set()).add(candidate)

    ranked = sorted(scores.items(), key=lambda item: (-item[1], item[0]))[:limit]
    results = []
    for doc_id, score in ranked:
        doc = documents.get(doc_id, {"id": doc_id})
        results.append({
            "id": doc_id,
            "score": score,
            "matched_terms": sorted(matched.get(doc_id, ())),
            "type": doc.get("type"),
            "project": doc.get("project"),
            "path": doc.get("path"),
            "title": doc.get("title"),
            "summary": doc.get("summary"),
            "key_docs": doc.get("key_docs", [])[:5],
        })
    return results


def load_graph() -> Dict:
    return json.loads(_require(GRAPH_PATH).read_text(encoding="utf-8"))


def _locate(target: str, graph: Dict) -> Optional[int]:
    """A path, title, alias or stem -> node index, as a [[wikilink]] would resolve."""
    found = Resolver(notes_from_graph(graph)).resolve(target)
    if found is None:
        return None
    return next(i for i, node in enumerate(graph["nodes"]) if node["path"] == found)


def _brief(node: Dict) -> Dict:
    return {key: node[key] for key in ("path", "title", "project", "kind", "summary")}


def get_note(target: str, graph: Optional[Dict] = None) -> Optional[Dict]:
    """One note with its text, backlinks and outgoing links; None when unknown."""
    graph = graph or load_graph()
    index = _locate(target, graph)
    if index is None:
        return None
    nodes = graph["nodes"]
    links = [_brief(nodes[t]) for s, t in graph["edges"] if s == index]
    backlinks = [_brief(nodes[s]) for s, t in graph["edges"] if t == index]
    return {
        **nodes[index],
        "text": (DOCS_DIR / nodes[index]["path"]).read_text(encoding="utf-8", errors="replace"),
        "links": links, "backlinks": backlinks,
    }


def get_neighbours(target: str, depth: int = 1, graph: Optional[Dict] = None) -> List[Dict]:
    """Notes within `depth` links of a note, nearest first, in either direction."""
    graph = graph or load_graph()
    start = _locate(target, graph)
    if start is None:
        return []
    adjacent: Dict[int, set] = {}
    for source, dest in graph["edges"]:
        adjacent.setdefault(source, set()).add(dest)
        adjacent.setdefault(dest, set()).add(source)
    seen = {start: 0}
    frontier = [start]
    for level in range(1, depth + 1):
        frontier = sorted({n for i in frontier for n in adjacent.get(i, ())} - set(seen))
        seen.update({i: level for i in frontier})
    del seen[start]
    return [{**_brief(graph["nodes"][i]), "distance": d}
            for i, d in sorted(seen.items(), key=lambda row: (row[1], row[0]))]


def get_hot() -> str:
    """The hot cache: what an agent reads first to catch up."""
    return _require(BRAIN_DIR / "hot.md").read_text(encoding="utf-8")


def vault_lint(graph: Optional[Dict] = None) -> Dict:
    """Deterministic vault health: counts, worst unresolved targets, orphans."""
    graph = graph or load_graph()
    connected = {i for edge in graph["edges"] for i in edge}
    orphans = [n["path"] for i, n in enumerate(graph["nodes"])
               if i not in connected and n["project"] != "brain"]
    unresolved = sorted(graph["unresolved"].items(), key=lambda row: (-len(row[1]), row[0]))
    return {
        "counts": graph["counts"],
        "unresolved": [{"target": t, "pages": len(p), "example": p[0]}
                       for t, p in unresolved[:50]],
        "orphans": len(orphans), "orphan_sample": orphans[:50],
    }
