"""
MkDocs hook: the site side of the second brain.

docs/ stays a plain Obsidian vault; this hook makes the published site read it
the same way. It reads the graph the engine wrote (context/vault/graph.json) and
resolves links with the engine's Resolver, so the site cannot disagree with the
vault. It converts [[wikilinks]] and callouts, adds a backlinks panel to each
page, and publishes the graph and the browser assets: the views in brain.js
and the workspace in workspace.js, which reads the same graph and the pages
this hook renders.
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

from brain_site import views  # noqa: E402
from scripts.context_engine.config import GRAPH_PATH, NAV_DIR, NAV_FLEET_PATH  # noqa: E402
from scripts.context_engine.vault import (  # noqa: E402
    Resolver, WIKILINK, looks_like_link, map_prose, notes_from_graph, parse_wikilink,
)

ASSETS = Path(__file__).parent / "assets"
PUBLISHED = "assets/brain"
STYLES = ("brain.css", "workspace.css")
# In load order: workspace.js registers its view with brain.js. The graph engine
# (graph-engine.bundle.js) is published too, but brain.js loads it only on a page
# that draws a graph.
SCRIPTS = ("brain.js", "workspace.js")
PANEL_LIMIT = 40
_CALLOUT = re.compile(r"^(>[ \t]*)\[!(\w+)\]([+-]?)[ \t]*(.*)$")
# Obsidian callout type -> Material admonition type.
CALLOUT_TYPES = {
    "summary": "abstract", "tldr": "abstract", "hint": "tip", "important": "tip",
    "check": "success", "done": "success", "help": "question", "faq": "question",
    "caution": "warning", "attention": "warning", "fail": "failure", "missing": "failure",
    "error": "danger", "cite": "quote",
}

ATLAS_SLOT = '<div class="brain-view" data-brain-view="atlas"></div>'

state: Dict = {"graph": None, "resolver": None, "incoming": {}, "outgoing": {}, "urls": {},
               "navs": [], "colours": {}}


def _load_navs() -> list:
    """(name, tree) for every navigable corpus, in registry order; empty when the engine has not built."""
    if not NAV_FLEET_PATH.is_file():
        return []
    order = json.loads(NAV_FLEET_PATH.read_text(encoding="utf-8")).get("order") or []
    navs = []
    for name in order:
        path = NAV_DIR / f"{name}.json"
        if path.is_file():
            navs.append((name, json.loads(path.read_text(encoding="utf-8"))))
    return navs


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
    navs = _load_navs()
    state.update(graph=graph, resolver=Resolver(notes_from_graph(graph)),
                 incoming=incoming, outgoing=outgoing, navs=navs,
                 colours=site_palette(Path(config["docs_dir"]), [name for name, _ in navs]))
    config.extra_css.extend(f"{PUBLISHED}/{name}" for name in STYLES)
    config.extra_javascript.extend(f"{PUBLISHED}/{name}" for name in SCRIPTS)
    return config


def site_palette(docs_dir: Path, order: list[str]) -> dict[str, str]:
    """Each repository's colour: the vault's Obsidian colour groups, so the site and the app agree.

    The engine writes those groups only for repositories with a corpus; one it has not
    built yet falls back to the registry order the groups would have used.
    """
    settings = docs_dir / ".obsidian" / "graph.json"
    if settings.is_file():
        palette = views.obsidian_colours(json.loads(settings.read_text(encoding="utf-8")))
        if palette:
            return palette
    return views.colours(order)


def graph_payload(graph: dict, urls: dict[str, str], navs: list | None = None,
                  palette: dict[str, str] | None = None) -> dict:
    """The graph as the browser gets it: short keys, and only notes with a page.

    Each note carries where the constellation puts it (`x`, `y`) and how many
    notes it links with either way (`d`: a pair that links both ways counts
    once); `clusters` are the repositories' circles and `colours` the palette.
    `fingerprint` names the build of the vault, so a reader can tell which one a
    deployed site is showing.
    """
    palette = palette or {}
    keep = {i: n for i, n in enumerate(graph["nodes"]) if n["path"] in urls}
    index = {old: new for new, old in enumerate(sorted(keep))}
    edges = [[index[a], index[b]] for a, b in graph["edges"] if a in index and b in index]
    kept = [keep[i] for i in sorted(keep)]
    degree = [0] * len(kept)
    for a, b in {(min(a, b), max(a, b)) for a, b in edges if a != b}:
        degree[a] += 1
        degree[b] += 1
    layout = views.constellation(kept, degree)
    titles = {name: nav.get("title") or name for name, nav in navs or []}
    nodes = []
    for node, (x, y), d in zip(kept, layout["positions"], degree, strict=True):
        row = {"t": node["title"], "p": node["project"], "k": node["kind"],
               "u": urls[node["path"]], "s": node["summary"],
               "g": node["tags"], "f": node["path"], "w": node["words"], "x": x, "y": y, "d": d}
        repo = posixpath.splitext(posixpath.basename(node["path"]))[0]
        if node["kind"] == "project" and repo in palette:
            row["c"] = palette[repo]   # a project note wears its repository's colour
        nodes.append(row)
    return {
        "fingerprint": graph.get("fingerprint", ""),
        "nodes": nodes,
        "edges": edges,
        "colours": palette,
        "concept": views.CONCEPT,
        "neutral": views.NEUTRAL,
        "clusters": [{**c, "t": titles.get(c["p"], c["p"] or "(root)")} for c in layout["clusters"]],
    }


def on_files(files, config):
    for asset in sorted(ASSETS.iterdir()):
        files.append(File.generated(config, f"{PUBLISHED}/{asset.name}",
                                    abs_src_path=str(asset)))
    state["urls"] = {f.src_uri: f.url for f in files.documentation_pages()}
    payload = graph_payload(state["graph"], state["urls"], state["navs"], state["colours"])
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


def _href(path: str, page_url: str) -> str | None:
    url = state["urls"].get(path)
    if url is None:
        return None
    return posixpath.relpath(url or ".", page_url or ".") + "/"


def _illustrate(content: str, page) -> str:
    """The Atlas on its page; a repository's emblem under the H1 of its project note."""
    link = lambda target: _href(target, page.url)  # noqa: E731
    if ATLAS_SLOT in content:
        svg = views.fleet_atlas(state["navs"], state["colours"], link)
        return content.replace(ATLAS_SLOT, f'<div class="brain-view" data-brain-view="atlas">{svg}</div>')
    if page.meta.get("kind") == "project":
        name = posixpath.splitext(posixpath.basename(page.file.src_uri))[0]
        nav = dict(state["navs"]).get(name)
        emblem = nav and views.project_emblem(nav, state["colours"].get(name, views.NEUTRAL), link)
        if emblem and "</h1>" in content:
            figure = (f'<figure class="atlas-emblem">{emblem}<figcaption>{html.escape(nav.get("title") or name)}'
                      " by section: each wedge is a folder of its documentation, sized by pages. "
                      "Select one to open it.</figcaption></figure>")
            return content.replace("</h1>", "</h1>" + figure, 1)
    return content


def on_page_content(content, page, config, files):
    path = page.file.src_uri
    content = _illustrate(content, page)
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
