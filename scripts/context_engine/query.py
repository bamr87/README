"""
Read-side API over the committed context tree.

Used by both the CLI (`python3 -m scripts.context_engine query ...`) and
the MCP server (mcp/server.py). Purely read-only: it never rebuilds.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional

from .config import (
    APEX_PATH, BRAIN_DIR, CARDS_DIR, CONTEXT_INDEX_PATH, DOCS_DIR, FACTS_DIR,
    GRAPH_PATH, MANIFEST_PATH, NAV_DIR, NAV_FLEET_PATH, ROOT,
)
from .vault import Resolver, notes_from_graph


class ContextMissing(RuntimeError):
    """The context tree has not been built yet."""


def _require(path: Path) -> Path:
    if not path.is_file():
        raise ContextMissing(
            f"{path.relative_to(ROOT)} not found - run "
            "`python3 -m scripts.context_engine build` first")
    return path


def load_index() -> Dict:
    return json.loads(_require(CONTEXT_INDEX_PATH).read_text(encoding="utf-8"))


def get_apex() -> str:
    return _require(APEX_PATH).read_text(encoding="utf-8")


def get_card(name: str) -> str:
    return _require(CARDS_DIR / f"{name}.md").read_text(encoding="utf-8")


def get_facts(name: str) -> Dict:
    return json.loads(_require(FACTS_DIR / f"{name}.json").read_text(encoding="utf-8"))


def get_nav(name: Optional[str] = None) -> Dict:
    """Navigation tree for one corpus, or the fleet navigation manifest."""
    path = NAV_FLEET_PATH if not name else NAV_DIR / f"{name}.json"
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


def get_manifest() -> Dict:
    return json.loads(_require(MANIFEST_PATH).read_text(encoding="utf-8"))


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
