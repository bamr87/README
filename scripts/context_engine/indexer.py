"""
Query layer: builds context/index/context_index.json and manifest.json.

The index carries a compact inverted term index over the context layer
(cards + apex + facts) so the CLI and the MCP server can answer searches
without re-reading the tree.
"""

import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from typing import Dict, List, Optional

from . import ENGINE_VERSION
from .config import CONTEXT_INDEX_PATH, INDEX_DIR, MANIFEST_PATH
from .registry import Registry

_TOKEN = re.compile(r"[a-z0-9][a-z0-9_.-]{2,}")
_STOPWORDS = {
    "the", "and", "for", "with", "this", "that", "from", "are", "was",
    "you", "your", "has", "have", "not", "its", "per", "all", "one",
    "docs", "documentation", "file", "files", "generated",
}


def _tokens(text: str) -> Counter:
    counts: Counter = Counter()
    for token in _TOKEN.findall(text.lower()):
        token = token.strip("._-")
        if len(token) >= 3 and token not in _STOPWORDS:
            counts[token] += 1
    return counts


def build_index(registry: Registry, facts_by_name: Dict[str, Dict],
                cards: Dict[str, str], apex_md: str,
                enrichment: str = "heuristic") -> Dict:
    documents: List[Dict] = []
    term_index: Dict[str, Dict[str, int]] = defaultdict(dict)

    def add_document(doc_id: str, doc: Dict, text: str) -> None:
        documents.append({"id": doc_id, **doc})
        for token, count in _tokens(text).items():
            term_index[token][doc_id] = count

    add_document("apex", {
        "type": "apex",
        "path": "context/README.md",
        "title": "bamr87 - consolidated README",
        "project": None,
    }, apex_md)

    for project in registry.active():
        facts = facts_by_name.get(project.name, {})
        identity = facts.get("identity") or {}
        card_text = cards.get(project.name, "")
        add_document(f"card:{project.name}", {
            "type": "card",
            "path": f"context/cards/{project.name}.md",
            "title": identity.get("title") or project.name,
            "project": project.name,
            "summary": identity.get("summary") or project.description,
            "kind": project.kind,
            "topics": project.topics,
            "key_docs": [f"docs/{project.name}/{d}" for d in facts.get("key_docs") or []],
        }, card_text + "\n" + json.dumps(facts))

    index = {
        "metadata": {
            "generator": "scripts/context_engine",
            "engine_version": ENGINE_VERSION,
            "enrichment": enrichment,
            "project_count": len(registry.active()),
            "corpus_index": "docs/docs_index.json",
        },
        "projects": {
            name: {
                "repo": facts["project"]["repo"],
                "kind": facts["project"]["kind"],
                "status": facts["project"]["status"],
                "corpus_files": (facts.get("corpus") or {}).get("file_count", 0),
                "fingerprint": (facts.get("corpus") or {}).get("fingerprint"),
                "card": f"context/cards/{name}.md",
                "facts": f"context/facts/{name}.json",
            }
            for name, facts in facts_by_name.items()
        },
        "documents": documents,
        "terms": {token: dict(sorted(hits.items()))
                  for token, hits in sorted(term_index.items())},
    }
    return index


def write_index(index: Dict, docs_index: Optional[Dict] = None) -> None:
    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    CONTEXT_INDEX_PATH.write_text(
        json.dumps(index, indent=2, sort_keys=False) + "\n", encoding="utf-8")

    manifest = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "engine_version": ENGINE_VERSION,
        "enrichment": index["metadata"]["enrichment"],
        "project_count": index["metadata"]["project_count"],
        "fingerprints": {name: info.get("fingerprint")
                         for name, info in index["projects"].items()},
        "corpus_index_present": docs_index is not None,
        "corpus_index_generated_at": (docs_index or {}).get("metadata", {}).get("generated_at"),
    }
    MANIFEST_PATH.write_text(
        json.dumps(manifest, indent=2, sort_keys=False) + "\n", encoding="utf-8")
