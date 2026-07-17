"""
Read-side API over the committed context tree.

Used by both the CLI (`python3 -m scripts.context_engine query ...`) and
the MCP server (mcp/server.py). Purely read-only: it never rebuilds.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional

from .config import (
    APEX_PATH, CARDS_DIR, CONTEXT_INDEX_PATH, FACTS_DIR, MANIFEST_PATH, ROOT,
)


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
