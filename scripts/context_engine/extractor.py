"""
Facts extraction (L2 of the pyramid).

Distills each project's aggregated corpus (docs/<name>/) plus its registry
entry into a structured, machine-readable fact sheet. Works entirely
offline from the committed corpus; when docs/docs_index.json is present its
per-document metadata is folded into the rollups.
"""

import hashlib
import json
import re
from collections import Counter
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import yaml

from . import ENGINE_VERSION
from .config import DOCS_DIR, DOCS_INDEX_PATH
from .registry import Project

FACTS_SCHEMA_VERSION = "1.0"

# Files that signal how a project is governed / operated.
SIGNAL_FILES = (
    "SCHEMA.md", "CLAUDE.md", "AGENTS.md", "CONTRIBUTING.md",
    "CHANGELOG.md", "SECURITY.md", "CODE_OF_CONDUCT.md",
)

README_CANDIDATES = ("README.md", "readme.md", "index.md", "home.md")

_BOILERPLATE_LINE = re.compile(r"^(\[!\[|!\[|<|\||#|---|===|```|\{%|\{\{)")


def _split_frontmatter(text: str) -> Tuple[Dict, str]:
    if text.startswith("---"):
        match = re.search(r"\n---\s*\n", text[3:])
        if match:
            try:
                fm = yaml.safe_load(text[3 : match.start() + 3])
                if isinstance(fm, dict):
                    return fm, text[3 + match.end():]
            except yaml.YAMLError:
                pass
    return {}, text


def _extract_title(fm: Dict, body: str, fallback: str) -> str:
    title = fm.get("title")
    if isinstance(title, str) and title.strip():
        return title.strip()
    h1 = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
    if h1:
        return h1.group(1).strip()
    return fallback


def _extract_summary(body: str, limit: int = 320) -> str:
    """First substantive paragraph of a markdown body."""
    for block in re.split(r"\n\s*\n", body):
        lines = [ln.strip() for ln in block.strip().splitlines()]
        lines = [ln for ln in lines if ln and not _BOILERPLATE_LINE.match(ln)]
        if not lines:
            continue
        text = " ".join(lines)
        text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", text)          # images
        text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)       # links -> text
        text = re.sub(r"[*_`>]", "", text)
        text = " ".join(text.split())
        if len(text) >= 20:
            return text[: limit - 1] + "…" if len(text) > limit else text
    return ""


def _find_readme(corpus_dir: Path) -> Optional[Path]:
    for name in README_CANDIDATES:
        candidate = corpus_dir / name
        if candidate.is_file():
            return candidate
    for candidate in sorted(corpus_dir.glob("*.md")):
        return candidate
    return None


def load_docs_index(path: Path = DOCS_INDEX_PATH) -> Optional[Dict]:
    """Load docs/docs_index.json if present (shared across projects)."""
    if not path.is_file():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None


def _index_rollups(docs_index: Optional[Dict], name: str) -> Dict:
    """Per-project rollups derived from the corpus index, when available."""
    if not docs_index:
        return {}
    docs = [d for d in docs_index.get("documents", [])
            if d.get("repository") == name]
    if not docs:
        return {}
    tags: Counter = Counter()
    categories: Counter = Counter()
    languages: Counter = Counter()
    words = 0
    for doc in docs:
        words += int(doc.get("word_count") or 0)
        for tag in doc.get("tags") or []:
            if isinstance(tag, str):
                tags[tag.lower()] += 1
        category = doc.get("category")
        if isinstance(category, str):
            categories[category] += 1
        for block in doc.get("code_blocks") or []:
            lang = block.get("language")
            if isinstance(lang, str) and lang:
                languages[lang.lower()] += 1
    return {
        "indexed_documents": len(docs),
        "total_words": words,
        "top_tags": [t for t, _ in tags.most_common(15)],
        "categories": dict(categories.most_common(10)),
        "code_languages": [l for l, _ in languages.most_common(8)],
    }


def extract_facts(project: Project, docs_dir: Path = DOCS_DIR,
                  docs_index: Optional[Dict] = None) -> Dict:
    """Build the L2 fact sheet for one project."""
    corpus_dir = docs_dir / project.name
    facts: Dict = {
        "schema_version": FACTS_SCHEMA_VERSION,
        "engine_version": ENGINE_VERSION,
        "project": {
            "name": project.name,
            "repo": project.repo,
            "url": project.url,
            "branch": project.branch,
            "status": project.status,
            "kind": project.kind,
            "external": project.external,
            "registry_description": project.description,
            "topics": list(project.topics),
        },
        "corpus": {"present": corpus_dir.is_dir(), "path": f"docs/{project.name}"},
        "identity": {},
        "signals": {},
        "structure": {},
        "rollups": {},
        "key_docs": [],
    }
    if not corpus_dir.is_dir():
        return facts

    entries: List[Tuple[str, int]] = []       # (relpath, size) for every md file
    top_dirs: Counter = Counter()
    signals = {name: False for name in SIGNAL_FILES}
    for path in sorted(corpus_dir.rglob("*.md")):
        if not path.is_file():
            continue
        rel = path.relative_to(corpus_dir).as_posix()
        entries.append((rel, path.stat().st_size))
        parts = rel.split("/")
        if len(parts) > 1:
            top_dirs[parts[0]] += 1
        for signal in SIGNAL_FILES:
            if path.name == signal:
                signals[signal] = True

    fingerprint = hashlib.sha256(
        "\n".join(f"{rel}:{size}" for rel, size in entries).encode("utf-8")
    ).hexdigest()[:16]

    facts["corpus"].update({
        "file_count": len(entries),
        "total_bytes": sum(size for _, size in entries),
        "fingerprint": fingerprint,
    })
    facts["signals"] = {
        "has_schema_md": signals["SCHEMA.md"],
        "has_claude_md": signals["CLAUDE.md"],
        "has_agents_md": signals["AGENTS.md"],
        "has_contributing": signals["CONTRIBUTING.md"],
        "has_changelog": signals["CHANGELOG.md"],
        "has_security_policy": signals["SECURITY.md"],
    }
    facts["structure"] = {
        "top_dirs": [
            {"name": name, "doc_count": count}
            for name, count in top_dirs.most_common(10)
        ],
        "root_docs": [rel for rel, _ in entries if "/" not in rel][:15],
    }

    readme = _find_readme(corpus_dir)
    if readme is not None:
        fm, body = _split_frontmatter(readme.read_text(encoding="utf-8", errors="replace"))
        facts["identity"] = {
            "readme": readme.relative_to(corpus_dir).as_posix(),
            "title": _extract_title(fm, body, project.name),
            "summary": _extract_summary(body),
            "headings": re.findall(r"^##\s+(.+)$", body, re.MULTILINE)[:10],
        }

    # Key documents: root-level signal files and the largest substantive docs.
    ranked = sorted(entries, key=lambda item: item[1], reverse=True)
    key_docs: List[str] = []
    if readme is not None:
        key_docs.append(readme.relative_to(corpus_dir).as_posix())
    for signal in SIGNAL_FILES:
        rel = signal
        if signals[signal] and rel not in key_docs and (corpus_dir / rel).is_file():
            key_docs.append(rel)
    for rel, size in ranked:
        if len(key_docs) >= 8:
            break
        if size < 500 or rel in key_docs or rel.count("/") > 2:
            continue
        key_docs.append(rel)
    facts["key_docs"] = key_docs[:8]

    facts["rollups"] = _index_rollups(docs_index, project.name)
    return facts
