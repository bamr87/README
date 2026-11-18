"""
The vault: docs/ read as one Obsidian knowledge base.

This is the single definition of what a note is and what a link points at.
The crawl (weave), the note generator, the query layer and the MkDocs hook all
resolve links here, so the Obsidian app, the published site and MCP clients
see the same graph.

Weaving makes links resolve everywhere. Upstream Jekyll sites link by permalink
(`/quests/foo/`) and by title (`[[Foo]]`); neither works in Obsidian or MkDocs.
`weave_pages` rewrites the ones it can resolve into path-qualified wikilinks.
Anything unresolved is left as written and reported by `lint`.
"""

import hashlib
import json
import posixpath
import re
import unicodedata
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable, Dict, Iterable, List, Optional, Tuple
from urllib.parse import unquote

import yaml

from .config import DOCS_DIR, GRAPH_PATH

GRAPH_SCHEMA_VERSION = "1.0"
SUMMARY_LIMIT = 180
SKIP_TOP = {"browse", "results"}            # machine reports, not knowledge

_FRONT_MATTER = re.compile(r"\A---\s*\n(.*?)\n---[ \t]*(?:\n|\Z)", re.S)
_FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})")
_INLINE_CODE = re.compile(r"(`+)(?:(?!\1).)+?\1")
# `\|` is how a wikilink's alias is written inside a table row.
WIKILINK = re.compile(r"(!?)\[\[([^\[\]\n]+?)\]\]")
MD_LINK = re.compile(r"(?<!!)\[([^\[\]\n]*)\]\(\s*<?([^()\s>]+(?:\([^()\s]*\)[^()\s>]*)*)>?(?:\s+\"[^\"]*\")?\s*\)")
_LIQUID = re.compile(r"\{\{.*?\}\}|\{%.*?%\}")
_SCHEME = re.compile(r"^[a-z][a-z0-9+.-]*:", re.I)
_INDEX_STEMS = {"index", "readme", "home"}


def norm(text: str) -> str:
    """Fold a title for lookup: case, emoji, punctuation and spacing don't count."""
    text = unicodedata.normalize("NFKC", str(text)).casefold()
    text = re.sub(r"[^\w\s-]", " ", text)
    return " ".join(text.replace("_", " ").split())


def split_note(text: str) -> Tuple[Dict, str]:
    match = _FRONT_MATTER.match(text)
    if not match:
        return {}, text
    try:
        data = yaml.load(match.group(1), Loader=getattr(yaml, "CSafeLoader", yaml.SafeLoader))
    except yaml.YAMLError:
        return {}, text[match.end():]
    return (data if isinstance(data, dict) else {}), text[match.end():]


def map_prose(text: str, fn: Callable[[str], str]) -> str:
    """Apply `fn` to the prose of a document, skipping fenced and inline code."""
    out: List[str] = []
    prose: List[str] = []
    fence: Optional[str] = None

    def flush() -> None:
        if prose:
            block = "".join(prose)
            pos, parts = 0, []
            for code in _INLINE_CODE.finditer(block):
                parts.append(fn(block[pos:code.start()]))
                parts.append(code.group(0))
                pos = code.end()
            parts.append(fn(block[pos:]))
            out.append("".join(parts))
            prose.clear()

    for line in text.splitlines(keepends=True):
        marker = _FENCE.match(line)
        if fence is not None:
            out.append(line)
            if marker and marker.group(1)[0] == fence[0] \
                    and len(marker.group(1)) >= len(fence):
                fence = None
        elif marker:
            flush()
            out.append(line)
            fence = marker.group(1)
        else:
            prose.append(line)
    flush()
    return "".join(out)


def parse_wikilink(inner: str) -> Tuple[str, str, Optional[str]]:
    """`target#anchor|alias` -> (target, anchor, alias)."""
    inner = inner.replace("\\|", "|")
    target, _, alias = inner.partition("|")
    target, _, anchor = target.partition("#")
    return target.strip(), anchor.strip(), (alias.strip() or None)


def looks_like_link(target: str) -> bool:
    """Reject the `[[ "$x" != y ]]` shell tests that survive outside code fences."""
    if not target or len(target) > 120:
        return False
    return not re.search(r"[$\"'=<>`{}]|^\s*-[a-z]\b|\s(?:-eq|-ne|-gt|-lt|&&|\|\|)\s", target)


def _permalink_key(url: str) -> str:
    url = _LIQUID.sub("", unquote(url)).split("#")[0].split("?")[0]
    url = re.sub(r"(index)?\.html?$", "", url)
    return url.strip("/ ").casefold()


@dataclass
class Note:
    path: str                                  # relative to docs/
    title: str
    project: str
    kind: str = "doc"                          # doc | concept | project | map | note
    tags: List[str] = field(default_factory=list)
    aliases: List[str] = field(default_factory=list)
    permalink: str = ""
    summary: str = ""
    words: int = 0
    source_url: str = ""
    links: List[str] = field(default_factory=list)       # resolved note paths
    unresolved: List[str] = field(default_factory=list)  # wikilink targets


def _summary(meta: Dict, body: str) -> str:
    text = meta.get("description") or meta.get("excerpt") or ""
    if not isinstance(text, str) or not text.strip():
        text = ""
        for block in re.split(r"\n\s*\n", body):
            block = block.strip()
            if len(block) >= 40 and not re.match(r"[#|<\[!`>{-]", block):
                text = block
                break
    text = re.sub(r"\[\[(?:[^\]|]*\|)?([^\]]*)\]\]", r"\1", text)
    text = re.sub(r"!?\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"[*_`]", "", " ".join(text.split()))
    return text[: SUMMARY_LIMIT - 1] + "…" if len(text) > SUMMARY_LIMIT else text


def parse_note(path: str, text: str) -> Note:
    meta, body = split_note(text)
    stem = posixpath.basename(path)[:-3]
    title = meta.get("title")
    if not isinstance(title, (str, int, float)) or str(title).strip() == "":
        title = stem.replace("-", " ").replace("_", " ").title()
    tags = meta.get("tags")
    tags = [tags] if isinstance(tags, str) else tags if isinstance(tags, list) else []
    aliases = meta.get("aliases")
    aliases = [aliases] if isinstance(aliases, str) else aliases if isinstance(aliases, list) else []
    return Note(
        path=path, title=str(title).strip(),
        project=path.split("/")[0] if "/" in path else "",
        kind=str(meta.get("kind") or "doc"),
        tags=sorted({str(t).strip() for t in tags if str(t).strip()}),
        aliases=[str(a) for a in aliases],
        permalink=str(meta.get("permalink") or ""),
        summary=_summary(meta, body), words=len(body.split()),
        source_url=str(meta.get("source_url") or ""),
    )


class Resolver:
    """Finds the note a link means, the way Obsidian would, plus permalinks."""

    def __init__(self, notes: Iterable[Note]):
        self.paths: Dict[str, Note] = {}
        self.folded: Dict[str, str] = {}
        self.names: Dict[str, List[str]] = {}
        self.permalinks: Dict[str, List[str]] = {}
        for note in notes:
            self.paths[note.path] = note
            self.folded[note.path.casefold()] = note.path
            stem = posixpath.basename(note.path)[:-3]
            keys = {norm(note.title), *(norm(a) for a in note.aliases)}
            if stem.casefold() not in _INDEX_STEMS:
                keys.add(norm(stem))
            for key in keys:
                if key:
                    self.names.setdefault(key, []).append(note.path)
            if note.permalink:
                key = _permalink_key(note.permalink)
                if key:
                    self.permalinks.setdefault(key, []).append(note.path)

    def _pick(self, candidates: List[str], source: Optional[str]) -> str:
        """Same project first, then the brain's note on it, then the shortest path."""
        project = source.split("/")[0] if source else ""
        return min(candidates, key=lambda p: (
            p.split("/")[0] != project, not p.startswith("brain/"),
            p.count("/"), len(p), p))

    def by_path(self, target: str, source: Optional[str] = None) -> Optional[str]:
        target = target.strip("/")
        tries = [target, f"{target}.md", f"{target}/index.md", f"{target}/README.md"]
        if source:
            near = posixpath.normpath(posixpath.join(posixpath.dirname(source), target))
            tries = [near, f"{near}.md", f"{near}/index.md", f"{near}/README.md"] + tries
            project = source.split("/")[0]
            tries += [f"{project}/{t}" for t in tries[4:]]
        for attempt in tries:
            found = self.folded.get(attempt.casefold())
            if found:
                return found
        return None

    def resolve(self, target: str, source: Optional[str] = None) -> Optional[str]:
        """A wikilink target -> note path."""
        target = target.strip()
        if target.endswith(".md"):
            target = target[:-3]
        found = self.by_path(target, source)
        if found:
            return found
        base = target.rsplit("/", 1)[-1]
        for key in (norm(target), norm(base)):
            candidates = self.names.get(key)
            if candidates:
                return self._pick(candidates, source)
        return None

    def resolve_url(self, url: str, source: Optional[str] = None) -> Optional[str]:
        """A Markdown link target -> note path, or None when it leaves the vault."""
        raw = url.strip()
        if _SCHEME.match(raw) or raw.startswith("#"):
            return None
        liquid = bool(_LIQUID.search(raw))
        path = _LIQUID.sub("", unquote(raw)).split("#")[0].split("?")[0]
        if raw.startswith("/") or liquid:
            candidates = self.permalinks.get(_permalink_key(raw))
            if candidates:
                return self._pick(candidates, source)
            # Sites without permalinks serve a page at its own file path.
            if source and "/" in source:
                key = re.sub(r"(/index)?\.html?$", "", path).strip("/")
                return self.by_path(f"{source.split('/')[0]}/{key}") if key else None
            return None
        if not path or not source:
            return None
        joined = posixpath.normpath(posixpath.join(posixpath.dirname(source), path))
        joined = joined.rstrip("/")
        if joined.endswith(".md"):
            return self.folded.get(joined.casefold())
        for attempt in (f"{joined}.md", f"{joined}/index.md", f"{joined}/README.md"):
            found = self.folded.get(attempt.casefold())
            if found:
                return found
        return None


def wikilink_for(path: str, label: Optional[str] = None, anchor: str = "",
                 in_table: bool = False) -> str:
    """A path-qualified wikilink. Path-qualified links never turn ambiguous."""
    target = path[:-3] if path.endswith(".md") else path
    if anchor:
        target += f"#{anchor}"
    if label:
        return f"[[{target}{'\\|' if in_table else '|'}{label}]]"
    return f"[[{target}]]"


def weave_text(path: str, text: str, resolver: Resolver) -> Tuple[str, int]:
    """Make one page's links resolve in Obsidian and on the site. Idempotent."""
    meta_end = _FRONT_MATTER.match(text)
    head, body = (text[:meta_end.end()], text[meta_end.end():]) if meta_end else ("", text)
    count = 0

    def wikilink(match: "re.Match[str]", in_table: bool) -> str:
        nonlocal count
        bang, inner = match.group(1), match.group(2)
        target, anchor, alias = parse_wikilink(inner)
        if not looks_like_link(target) or "/" in target and resolver.by_path(target):
            return match.group(0)
        found = resolver.resolve(target, path)
        if not found:
            return match.group(0)
        count += 1
        return bang + wikilink_for(found, alias or target, anchor, in_table)

    def md_link(match: "re.Match[str]", in_table: bool) -> str:
        nonlocal count
        label, url = match.group(1), match.group(2)
        if not (url.startswith("/") or _LIQUID.search(url)) or "|" in label or not label.strip():
            return match.group(0)
        found = resolver.resolve_url(url, path)
        if not found:
            return match.group(0)
        count += 1
        anchor = url.split("#", 1)[1] if "#" in url else ""
        return wikilink_for(found, label.strip(), anchor, in_table)

    def prose(block: str) -> str:
        lines = []
        for line in block.splitlines(keepends=True):
            in_table = line.lstrip().startswith("|")
            line = WIKILINK.sub(lambda m: wikilink(m, in_table), line)
            lines.append(MD_LINK.sub(lambda m: md_link(m, in_table), line))
        return "".join(lines)

    return head + map_prose(body, prose), count


def weave_pages(pages: Dict[str, str], context: Optional[Dict[str, str]] = None
                ) -> Tuple[Dict[str, str], Dict[str, int]]:
    """Weave `pages`; `context` holds other notes links may point into."""
    context = context or {}
    resolver = Resolver(parse_note(path, text)
                        for path, text in {**context, **pages}.items())
    woven: Dict[str, str] = {}
    links = changed = 0
    for path, text in pages.items():
        woven[path], count = weave_text(path, text, resolver)
        links += count
        changed += woven[path] != text
    return woven, {"links": links, "pages": changed}


def extract_links(note: Note, body: str, resolver: Resolver) -> None:
    """Fill a note's outgoing links from its prose."""
    links: Dict[str, None] = {}
    unresolved: Dict[str, None] = {}

    def prose(block: str) -> str:
        for match in WIKILINK.finditer(block):
            target = parse_wikilink(match.group(2))[0]
            if not looks_like_link(target):
                continue
            found = resolver.resolve(target, note.path)
            if found:
                links[found] = None
            else:
                unresolved[target] = None
        for match in MD_LINK.finditer(block):
            found = resolver.resolve_url(match.group(2), note.path)
            if found:
                links[found] = None
        return block

    map_prose(body, prose)
    links.pop(note.path, None)
    note.links = sorted(links)
    note.unresolved = sorted(unresolved)


def scan(docs_dir: Path = DOCS_DIR) -> Tuple[Dict[str, Note], Resolver]:
    """Read the whole vault: every note, with its links resolved."""
    texts: Dict[str, str] = {}
    for path in sorted(docs_dir.rglob("*.md")):
        rel = path.relative_to(docs_dir).as_posix()
        if rel.split("/")[0] in SKIP_TOP or any(p.startswith(".") for p in rel.split("/")):
            continue
        texts[rel] = path.read_text(encoding="utf-8", errors="replace")
    notes = {rel: parse_note(rel, text) for rel, text in texts.items()}
    resolver = Resolver(notes.values())
    for rel, note in notes.items():
        extract_links(note, split_note(texts[rel])[1], resolver)
    return notes, resolver


def build_graph(notes: Dict[str, Note]) -> Dict:
    """The graph every surface reads: nodes, edges and unresolved targets."""
    ids = {path: i for i, path in enumerate(sorted(notes))}
    edges = sorted((ids[n.path], ids[t]) for n in notes.values()
                   for t in n.links if t in ids)
    degree = [0] * len(ids)
    for source, target in edges:
        degree[source] += 1
        degree[target] += 1
    unresolved: Dict[str, List[str]] = {}
    for note in notes.values():
        for target in note.unresolved:
            unresolved.setdefault(target, []).append(note.path)
    nodes = [{
        "path": path, "title": notes[path].title, "project": notes[path].project,
        "kind": notes[path].kind, "tags": notes[path].tags,
        "aliases": notes[path].aliases, "permalink": notes[path].permalink,
        "summary": notes[path].summary, "words": notes[path].words,
        "source_url": notes[path].source_url, "degree": degree[ids[path]],
    } for path in sorted(notes)]
    payload = json.dumps([nodes, edges], sort_keys=True, ensure_ascii=False)
    return {
        "schema_version": GRAPH_SCHEMA_VERSION,
        "fingerprint": hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16],
        "counts": {"notes": len(nodes), "edges": len(edges),
                   "orphans": sum(1 for d in degree if d == 0),
                   "unresolved": len(unresolved)},
        "nodes": nodes, "edges": edges,
        "unresolved": {k: sorted(v) for k, v in sorted(unresolved.items())},
    }


def write_graph(graph: Dict, path: Path = GRAPH_PATH) -> None:
    """One node or edge list per line, so a rebuild's diff stays readable."""
    path.parent.mkdir(parents=True, exist_ok=True)
    dump = lambda value: json.dumps(value, sort_keys=True, ensure_ascii=False)  # noqa: E731
    lines = ["{"]
    for key in ("schema_version", "fingerprint", "counts"):
        lines.append(f"{json.dumps(key)}: {dump(graph[key])},")
    lines.append('"nodes": [')
    lines.append(",\n".join(dump(node) for node in graph["nodes"]))
    lines.append("],")
    lines.append(f'"edges": {dump(graph["edges"])},')
    lines.append(f'"unresolved": {dump(graph["unresolved"])}')
    lines.append("}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def notes_from_graph(graph: Dict) -> List[Note]:
    """Rebuild the lookup side of the notes (the site hook has no need to rescan)."""
    return [Note(path=n["path"], title=n["title"], project=n["project"], kind=n["kind"],
                 tags=n["tags"], aliases=n["aliases"], permalink=n["permalink"])
            for n in graph["nodes"]]
