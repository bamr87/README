"""
MkDocs hook: the site side of the second brain.

docs/ stays a plain Obsidian vault; this hook makes the published site read it
the same way. It reads the graph the engine wrote (context/vault/graph.json) and
resolves links with the engine's Resolver, so the site cannot disagree with the
vault. It converts [[wikilinks]] and callouts, adds a backlinks panel to each
page, and publishes the graph and the browser assets.
"""

import html
import json
import posixpath
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional

from mkdocs.structure.files import File

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from scripts.context_engine.config import GRAPH_PATH  # noqa: E402
from scripts.context_engine.vault import (  # noqa: E402
    Resolver, WIKILINK, looks_like_link, map_prose, notes_from_graph, parse_wikilink,
)

ASSETS = Path(__file__).parent / "assets"
PUBLISHED = "assets/brain"
PANEL_LIMIT = 40
_CALLOUT = re.compile(r"^(>[ \t]*)\[!(\w+)\]([+-]?)[ \t]*(.*)$")
# Obsidian callout type -> Material admonition type.
CALLOUT_TYPES = {
    "summary": "abstract", "tldr": "abstract", "hint": "tip", "important": "tip",
    "check": "success", "done": "success", "help": "question", "faq": "question",
    "caution": "warning", "attention": "warning", "fail": "failure", "missing": "failure",
    "error": "danger", "cite": "quote",
}

state: Dict = {"graph": None, "resolver": None, "incoming": {}, "outgoing": {}, "urls": {}}


def on_config(config):
    if not GRAPH_PATH.is_file():
        raise SystemExit(f"{GRAPH_PATH} not found: run `python3 -m scripts.context_engine build`")
    graph = json.loads(GRAPH_PATH.read_text(encoding="utf-8"))
    incoming: Dict[str, List[int]] = {}
    outgoing: Dict[str, List[int]] = {}
    nodes = graph["nodes"]
    for source, target in graph["edges"]:
        outgoing.setdefault(nodes[source]["path"], []).append(target)
        incoming.setdefault(nodes[target]["path"], []).append(source)
    state.update(graph=graph, resolver=Resolver(notes_from_graph(graph)),
                 incoming=incoming, outgoing=outgoing)
    config.extra_css.append(f"{PUBLISHED}/brain.css")
    config.extra_javascript.append(f"{PUBLISHED}/d3-force.bundle.js")
    config.extra_javascript.append(f"{PUBLISHED}/brain.js")
    return config


def on_files(files, config):
    for asset in sorted(ASSETS.iterdir()):
        files.append(File.generated(config, f"{PUBLISHED}/{asset.name}",
                                    abs_src_path=str(asset)))
    state["urls"] = {f.src_uri: f.url for f in files.documentation_pages()}
    graph = state["graph"]
    # The browser needs less than the engine keeps; a node with no page is dropped.
    keep = {i: n for i, n in enumerate(graph["nodes"]) if n["path"] in state["urls"]}
    index = {old: new for new, old in enumerate(sorted(keep))}
    payload = {
        "nodes": [{"t": keep[i]["title"], "p": keep[i]["project"], "k": keep[i]["kind"],
                   "u": state["urls"][keep[i]["path"]], "s": keep[i]["summary"],
                   "g": keep[i]["tags"], "f": keep[i]["path"], "w": keep[i]["words"]}
                  for i in sorted(keep)],
        "edges": [[index[a], index[b]] for a, b in graph["edges"]
                  if a in index and b in index],
    }
    files.append(File.generated(config, f"{PUBLISHED}/graph.json",
                                content=json.dumps(payload, ensure_ascii=False,
                                                   separators=(",", ":"))))
    return files


def _relative(target: str, source: str) -> str:
    return posixpath.relpath(target, posixpath.dirname(source) or ".")


def render_wikilinks(markdown: str, source: str, resolver: Resolver) -> str:
    """[[target#anchor|label]] -> a Markdown link MkDocs can validate and rewrite."""
    def repl(match: "re.Match[str]") -> str:
        bang, inner = match.group(1), match.group(2)
        target, anchor, alias = parse_wikilink(inner)
        if not looks_like_link(target):
            return match.group(0)
        found = resolver.resolve(target, source)
        label = (alias or target).replace("[", "(").replace("]", ")")
        if not found:
            return f'<span class="brain-unresolved" title="No note yet">{html.escape(label)}</span>'
        href = _relative(found, source).replace(" ", "%20").replace(")", "%29")
        if anchor:
            href += "#" + re.sub(r"[^\w-]+", "-", anchor.lower()).strip("-")
        return f"[{label}]({href})"
    return map_prose(markdown, lambda block: WIKILINK.sub(repl, block))


def render_callouts(markdown: str) -> str:
    """Obsidian callouts -> Material admonitions."""
    lines = markdown.split("\n")
    out: List[str] = []
    i = 0
    while i < len(lines):
        match = _CALLOUT.match(lines[i])
        if not match:
            out.append(lines[i])
            i += 1
            continue
        kind = match.group(2).lower()
        kind = CALLOUT_TYPES.get(kind, kind)
        fold = {"+": "???+", "-": "???"}.get(match.group(3), "!!!")
        title = match.group(4).strip().replace('"', "'")
        out.append(f'{fold} {kind} "{title}"' if title else f"{fold} {kind}")
        out.append("")
        i += 1
        while i < len(lines) and lines[i].startswith(">"):
            out.append("    " + lines[i][1:].lstrip())
            i += 1
        out.append("")
    return "\n".join(out)


def on_page_markdown(markdown, page, config, files):
    resolver = state["resolver"]
    return render_callouts(render_wikilinks(markdown, page.file.src_uri, resolver))


def _link_list(indices: List[int], page_url: str) -> str:
    nodes = state["graph"]["nodes"]
    rows = sorted({i for i in indices if nodes[i]["path"] in state["urls"]},
                  key=lambda i: nodes[i]["title"].casefold())
    items = []
    for i in rows[:PANEL_LIMIT]:
        href = posixpath.relpath(state["urls"][nodes[i]["path"]] or ".", page_url or ".")
        items.append(f'<li><a href="{html.escape(href)}/">{html.escape(nodes[i]["title"])}</a>'
                     f'<span class="brain-origin">{html.escape(nodes[i]["project"])}</span></li>')
    more = len(rows) - PANEL_LIMIT
    if more > 0:
        items.append(f'<li class="brain-more">and {more} more</li>')
    return f"<ul>{''.join(items)}</ul>"


def on_page_content(content, page, config, files):
    path = page.file.src_uri
    if page.meta.get("kind") == "map" and page.meta.get("hide"):
        return content
    back = state["incoming"].get(path, [])
    out = state["outgoing"].get(path, [])
    source = page.meta.get("source_url")
    origin = ""
    if isinstance(source, str) and source.startswith("https://github.com/"):
        repo = page.meta.get("source_repo", "")
        origin = f'<p class="brain-source">Source: <a href="{html.escape(source)}">{html.escape(str(repo))}</a></p>'
    sections = []
    if back:
        sections.append(f"<details open><summary>Backlinks ({len(set(back))})</summary>"
                        f"{_link_list(back, page.url)}</details>")
    if out:
        sections.append(f"<details><summary>Outgoing links ({len(set(out))})</summary>"
                        f"{_link_list(out, page.url)}</details>")
    if not sections and not origin:
        return content
    return (content + f'<aside class="brain-panel" data-brain-path="{html.escape(path)}">'
            + origin + "".join(sections) + "</aside>")
