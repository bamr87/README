"""
Navigation layer of the pyramid.

Turns the published corpus (``docs/``) plus the registry's navigation
contract into one canonical navigation tree, then renders that tree onto
every surface that needs it:

  - ``context/nav/<project>.json`` + ``context/nav/index.json``
        frontend-agnostic tree (any sidebar renderer can consume it; the CLI
        and the MCP server serve it through ``query.py``)
  - ``nav.yml``
        the MkDocs surface: a generated ``nav`` plus the ``exclude_docs``
        rules that keep the site's page set identical to the tree.
        ``mkdocs.yml`` pulls it in with ``INHERIT``.
  - ``docs/browse/``
        human content maps - one page per project plus a fleet index

The tree is derived from the folder hierarchy, never hand-written:

  titles      frontmatter ``title`` -> first H1 -> humanized filename; a
              section takes the title of its own index page when it has one
  index pages ``index.md``/``README.md``/... become the section's landing
              page (Material's ``navigation.indexes``), so a section is a
              link rather than a dead label
  ordering    index first, then pages, then subsections; within each bucket
              by explicit frontmatter order (``nav_order``/``order``/
              ``weight``/``sidebar_position``) then title
  grouping    registry ``nav.groups`` lift matching paths into curated
              top-level sections; everything else keeps its folder position
  depth       pages below ``max_depth`` are flattened into the deepest
              allowed section (with a path-qualified title) rather than
              dropped - the sidebar always reaches every published page
  exclusions  registry globs, plus MkDocs' own rules (dot files, and a
              ``README.md`` shadowed by a sibling ``index.md``)

Output carries a content fingerprint and no timestamps, so rebuilding over
an unchanged corpus produces an empty diff.
"""

import hashlib
import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Tuple

import yaml

from . import ENGINE_VERSION
from .config import (
    BROWSE_DIR, DOCS_DIR, GENERATED_NOTICE, MKDOCS_NAV_PATH, NAV_DIR,
    NAV_FLEET_PATH, ROOT,
)
from .registry import NavDefaults, NavSpec, Project, Registry

NAV_SCHEMA_VERSION = "1.0"

# Frontmatter keys that pin an entry's position within its section.
ORDER_KEYS = ("nav_order", "order", "weight", "sidebar_position")
# Frontmatter flag that keeps a page out of the sidebar.
EXCLUDE_KEY = "nav_exclude"
# Only the first slice of a file is read to recover its title/order.
HEAD_BYTES = 8192

_FM_END = re.compile(r"\n---\s*\n")
_H1 = re.compile(r"^#\s+(.+)$", re.MULTILINE)
_ACRONYMS = {
    "ai", "api", "aws", "cd", "ci", "cli", "cms", "crm", "css", "csv", "db",
    "dns", "erp", "faq", "gcp", "gpu", "html", "http", "https", "id", "ide",
    "io", "ip", "js", "json", "jwt", "k8s", "llm", "mcp", "md", "npm", "os",
    "pdf", "pr", "prd", "qa", "rest", "rss", "sdk", "seo", "sql", "ssh", "ssl",
    "svg", "tls", "tui", "ui", "url", "ux", "vm", "xml", "yaml", "yml",
}
# Filenames that say nothing on their own - a section holding only one of
# these is better labelled by its folder.
GENERIC_STEMS = {
    "about", "agent", "agents", "claude", "doc", "docs", "home", "index",
    "main", "overview", "prompt", "readme", "skill",
}


# --------------------------------------------------------------------------
# glob matching
# --------------------------------------------------------------------------

def _glob_to_regex(pattern: str) -> "re.Pattern[str]":
    """Translate a nav glob to a regex (``*`` stays in one segment, ``**`` spans)."""
    out: List[str] = ["^"]
    i, n = 0, len(pattern)
    while i < n:
        char = pattern[i]
        if char == "*":
            if pattern.startswith("**", i):
                i += 2
                if pattern.startswith("/", i):      # `**/` also matches nothing
                    i += 1
                    out.append("(?:.*/)?")
                else:
                    out.append(".*")
                continue
            out.append("[^/]*")
        elif char == "?":
            out.append("[^/]")
        else:
            out.append(re.escape(char))
        i += 1
    out.append("$")
    return re.compile("".join(out))


class GlobSet:
    """A compiled set of nav globs; a directory match covers its subtree."""

    def __init__(self, patterns: Iterable[str]):
        self.patterns = [p for p in patterns if p]
        self._regexes = [_glob_to_regex(p) for p in self.patterns]

    def __bool__(self) -> bool:
        return bool(self._regexes)

    def matches(self, path: str) -> bool:
        return any(rx.match(path) for rx in self._regexes)

    def matches_any_parent(self, path: str) -> bool:
        """True when the path or any of its ancestors matches."""
        parts = path.split("/")
        for depth in range(1, len(parts) + 1):
            if self.matches("/".join(parts[:depth])):
                return True
        return False


# --------------------------------------------------------------------------
# document metadata
# --------------------------------------------------------------------------

def humanize(stem: str) -> str:
    """`getting-started_v2` -> `Getting Started V2`; keeps deliberate casing."""
    cleaned = stem.lstrip("._").replace("-", " ").replace("_", " ").strip()
    if not cleaned:
        return stem
    words = []
    for word in cleaned.split():
        if word.lower() in _ACRONYMS:
            words.append(word.upper())
        elif word[:1].islower() and word[1:].islower():
            words.append(word.capitalize())
        else:
            words.append(word)                      # CamelCase / ALLCAPS as-is
    return " ".join(words)


# Sidebar labels are short, plain text: inline markdown and runaway titles
# make an unreadable sidebar, and the page still carries its full H1.
TITLE_LIMIT = 72
_TITLE_NOISE = re.compile(r"[`*_]+")
_TITLE_LINK = re.compile(r"\[([^\]]+)\]\([^)]*\)")


def clean_title(text: str, limit: int = TITLE_LIMIT) -> str:
    """Flatten a document title into a sidebar label."""
    text = _TITLE_LINK.sub(r"\1", str(text))
    text = _TITLE_NOISE.sub("", text)
    text = " ".join(text.split()).strip(" -–—:·|")
    if len(text) <= limit:
        return text
    clipped = text[:limit].rsplit(" ", 1)[0].rstrip(" -–—:,")
    return (clipped or text[:limit]) + "…"


@dataclass
class DocMeta:
    """What navigation needs to know about one markdown file."""

    title: str
    order: Optional[float] = None
    icon: Optional[str] = None
    excluded: bool = False


def read_doc_meta(path: Path) -> DocMeta:
    """Recover title/order/icon from a document's frontmatter or first H1."""
    fallback = humanize(path.stem)
    try:
        with path.open("r", encoding="utf-8", errors="replace") as handle:
            head = handle.read(HEAD_BYTES)
    except OSError:
        return DocMeta(title=fallback)

    frontmatter: Dict = {}
    body = head
    if head.startswith("---"):
        match = _FM_END.search(head, 3)
        if match:
            try:
                loaded = yaml.safe_load(head[3:match.start() + 1])
                if isinstance(loaded, dict):
                    frontmatter = loaded
            except yaml.YAMLError:
                frontmatter = {}
            body = head[match.end():]

    title = frontmatter.get("title")
    if not isinstance(title, str) or not title.strip():
        h1 = _H1.search(body)
        title = h1.group(1).strip() if h1 else fallback
    title = clean_title(title) or fallback

    order: Optional[float] = None
    for key in ORDER_KEYS:
        value = frontmatter.get(key)
        if isinstance(value, (int, float)) and not isinstance(value, bool):
            order = float(value)
            break

    icon = frontmatter.get("icon")
    return DocMeta(
        title=title,
        order=order,
        icon=icon if isinstance(icon, str) and icon.strip() else None,
        excluded=bool(frontmatter.get(EXCLUDE_KEY)),
    )


# --------------------------------------------------------------------------
# the tree
# --------------------------------------------------------------------------

@dataclass(eq=False)
class NavNode:
    """One sidebar entry: a page, a folder-derived section, or a group."""

    type: str                                   # page | section | group
    title: str
    path: Optional[str] = None                  # docs-relative, pages only
    rel: Optional[str] = None                   # project-relative
    icon: Optional[str] = None
    order: Optional[float] = None
    is_index: bool = False                      # this page is its section's landing
    index: Optional[str] = None                 # docs-relative landing page
    folder: Optional[str] = None                # folder this page stands in for
    children: List["NavNode"] = field(default_factory=list)

    @property
    def is_page(self) -> bool:
        return self.type == "page"

    def pages(self) -> int:
        if self.is_page:
            return 1
        return sum(child.pages() for child in self.children)

    def sections(self) -> int:
        if self.is_page:
            return 0
        return len(
            [c for c in self.children if not c.is_page]
        ) + sum(c.sections() for c in self.children if not c.is_page)

    def depth(self) -> int:
        if self.is_page or not self.children:
            return 0
        return 1 + max(child.depth() for child in self.children)

    def to_dict(self) -> Dict:
        node: Dict = {"type": self.type, "title": self.title}
        if self.path:
            node["path"] = self.path
        if self.rel is not None:
            node["rel"] = self.rel
        if self.icon:
            node["icon"] = self.icon
        if self.order is not None:
            node["order"] = self.order
        if self.folder:
            node["folder"] = self.folder
        if self.is_index:
            node["is_index"] = True
        if not self.is_page:
            if self.index:
                node["index"] = self.index
            node["pages"] = self.pages()
            node["children"] = [child.to_dict() for child in self.children]
        return node


@dataclass
class NavContext:
    """Resolved rules for one project's walk."""

    project: str
    docs_dir: Path
    index_names: Sequence[str]
    section_titles: Dict[str, str]
    excludes: GlobSet
    max_depth: int
    publish_hidden: bool
    skipped: List[str] = field(default_factory=list)


def _sort_key(node: NavNode) -> Tuple[int, int, float, str]:
    """Landing page, then pages, then sections; explicit order, then title."""
    bucket = 0 if node.is_page else 1
    order = node.order if node.order is not None else 1e9
    return (bucket, 0 if node.is_index else 1, order, node.title.casefold())


def _hidden(name: str) -> bool:
    return name.startswith(".")


def _disambiguate(children: List[NavNode]) -> None:
    """Qualify sibling entries that share a title (the corpus has real ones)."""
    seen: Dict[str, List[NavNode]] = {}
    for child in children:
        seen.setdefault(child.title.casefold(), []).append(child)
    for clashing in seen.values():
        if len(clashing) < 2:
            continue
        for node in clashing:
            source = (node.rel or "").rsplit("/", 1)[-1]
            stem = source[:-3] if source.endswith(".md") else source
            if stem and stem.casefold() != node.title.casefold():
                node.title = f"{node.title} ({stem})"


def _pick_index(files: Dict[str, Path], ctx: NavContext) -> Optional[str]:
    for candidate in ctx.index_names:
        if candidate in files:
            return candidate
    return None


def _scan(directory: Path, rel: str, ctx: NavContext, depth: int) -> Optional[NavNode]:
    """Recursively turn one corpus directory into a section node."""
    try:
        entries = sorted(directory.iterdir(), key=lambda p: p.name)
    except OSError:
        return None

    files: Dict[str, Path] = {}
    subdirs: List[Path] = []
    for entry in entries:
        entry_rel = f"{rel}/{entry.name}" if rel else entry.name
        if _hidden(entry.name) and not ctx.publish_hidden:
            ctx.skipped.append(entry_rel)
            continue
        if ctx.excludes.matches(entry_rel):
            ctx.skipped.append(entry_rel)
            continue
        if entry.is_dir():
            subdirs.append(entry)
        elif entry.is_file() and entry.suffix.lower() == ".md":
            files[entry.name] = entry

    # MkDocs drops README.md when a sibling index.md exists - mirror that so
    # the sidebar never points at a page the site does not build.
    if "index.md" in files:
        for shadowed in ("README.md", "readme.md"):
            if shadowed in files:
                ctx.skipped.append(f"{rel}/{shadowed}" if rel else shadowed)
                files.pop(shadowed)

    index_name = _pick_index(files, ctx)
    children: List[NavNode] = []
    index_path: Optional[str] = None
    index_meta: Optional[DocMeta] = None

    for name, path in files.items():
        meta = read_doc_meta(path)
        entry_rel = f"{rel}/{name}" if rel else name
        if meta.excluded:
            ctx.skipped.append(entry_rel)
            continue
        node = NavNode(type="page", title=meta.title,
                       path=f"{ctx.project}/{entry_rel}", rel=entry_rel,
                       icon=meta.icon, order=meta.order)
        if name == index_name:
            index_path = node.path
            index_meta = meta
            node.is_index = True
        children.append(node)

    flatten = depth >= ctx.max_depth
    for subdir in subdirs:
        sub_rel = f"{rel}/{subdir.name}" if rel else subdir.name
        child = _scan(subdir, sub_rel, ctx, depth + 1)
        if child is None:
            continue
        if flatten:
            # Past the depth cap: keep every page reachable by lifting it into
            # this section with a path-qualified title instead of nesting.
            children.extend(_flatten_node(child, subdir.name))
        else:
            children.append(child)

    if not children:
        return None

    _disambiguate(children)
    children.sort(key=_sort_key)
    title = ctx.section_titles.get(directory.name) or \
        (index_meta.title if index_meta else None) or humanize(directory.name)

    # A folder holding a single page is a wrapper, not a section: promote the
    # page so the sidebar has one entry instead of a click-through to one.
    if len(children) == 1 and children[0].is_page:
        page = children[0]
        stem = (page.rel or "").rsplit("/", 1)[-1].removesuffix(".md").casefold()
        if stem in GENERIC_STEMS or directory.name in ctx.section_titles:
            page.title = title
        page.order = None
        page.is_index = False
        page.folder = rel or page.folder
        return page

    return NavNode(type="section", title=title, rel=rel or None,
                   icon=index_meta.icon if index_meta else None,
                   index=index_path, children=children)


def _flatten_node(node: NavNode, prefix: str) -> List[NavNode]:
    """Collapse a subtree into path-qualified pages (depth-cap overflow)."""
    if node.is_page:
        return [NavNode(type="page", title=f"{prefix} › {node.title}"
                        if node.title != prefix else prefix,
                        path=node.path, rel=node.rel, folder=node.folder,
                        icon=node.icon, order=node.order,
                        is_index=node.is_index)]
    out: List[NavNode] = []
    for child in node.children:
        out.extend(_flatten_node(child, f"{prefix} › {child.title}"
                                 if not child.is_page else prefix))
    return out


def _extract(node: NavNode, patterns: GlobSet) -> List[NavNode]:
    """Detach the shallowest nodes matching `patterns` from a section."""
    taken: List[NavNode] = []
    kept: List[NavNode] = []
    for child in node.children:
        handle = child.rel or child.folder
        if (handle and patterns.matches(handle)) or (
                child.folder and patterns.matches(child.folder)):
            taken.append(child)
            continue
        if not child.is_page:
            taken.extend(_extract(child, patterns))
            if not child.children:
                continue                          # section emptied by the lift
        kept.append(child)
    node.children = kept
    return taken


def _apply_groups(root: NavNode, spec: NavSpec) -> None:
    """Lift registry-declared groups to the top of a project's sidebar."""
    if not spec.groups:
        return
    groups: List[NavNode] = []
    for position, group in enumerate(spec.groups):
        taken = _extract(root, GlobSet(group.patterns))
        if not taken:
            continue
        if len(taken) == 1 and not taken[0].is_page:
            node = taken[0]                       # no wrapper around one section
            node.title = group.title
            node.type = "group"
            node.order = float(position)
            groups.append(node)
            continue
        taken.sort(key=_sort_key)
        index = next((n.index for n in taken if not n.is_page and n.index), None)
        groups.append(NavNode(type="group", title=group.title,
                              order=float(position), index=index,
                              children=taken))
    if not groups:
        return
    rest = sorted(root.children, key=_sort_key)
    groups.sort(key=lambda n: n.order or 0.0)
    root.children = groups + rest


def _fingerprint(payload: Dict) -> str:
    return hashlib.sha256(
        json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()[:16]


def build_project_nav(name: str, title: str, spec: NavSpec,
                      defaults: NavDefaults,
                      docs_dir: Optional[Path] = None) -> Dict:
    """Build the navigation tree for one corpus directory (`docs/<name>/`)."""
    docs_dir = docs_dir or DOCS_DIR
    corpus = docs_dir / name
    ctx = NavContext(
        project=name,
        docs_dir=docs_dir,
        index_names=defaults.index_names,
        section_titles=defaults.section_titles,
        excludes=GlobSet(list(defaults.exclude) + list(spec.exclude)),
        max_depth=spec.max_depth or defaults.max_depth,
        publish_hidden=defaults.publish_hidden,
    )
    root = _scan(corpus, "", ctx, 1) if corpus.is_dir() else None
    if root is None:
        root = NavNode(type="section", title=title, children=[])
    elif root.is_page:
        # A corpus of one page still needs a section root to hang the tree on.
        root = NavNode(type="section", title=title, index=root.path,
                       children=[root])
    root.title = title
    _apply_groups(root, spec)

    tree = root.to_dict()
    return {
        "schema_version": NAV_SCHEMA_VERSION,
        "engine_version": ENGINE_VERSION,
        "project": name,
        "title": title,
        "corpus": f"docs/{name}",
        "counts": {
            "pages": root.pages(),
            "sections": root.sections(),
            "max_depth": root.depth(),
            "skipped": len(ctx.skipped),
        },
        "skipped": sorted(ctx.skipped)[:100],
        "fingerprint": _fingerprint(tree),
        "tree": tree,
    }


def build_fleet_nav(registry: Registry, docs_dir: Optional[Path] = None) -> Dict:
    """Build every project's tree plus the unregistered leftovers in docs/."""
    docs_dir = docs_dir or DOCS_DIR
    defaults = registry.navigation
    navs: Dict[str, Dict] = {}
    for project in registry.nav_ordered():
        navs[project.name] = build_project_nav(
            project.name, project.nav_title, project.nav, defaults, docs_dir)

    known = {p.name for p in registry.projects} | {"browse"}
    extras: List[Dict] = []
    if docs_dir.is_dir():
        for entry in sorted(docs_dir.iterdir()):
            if not entry.is_dir() or entry.name in known or _hidden(entry.name):
                continue
            nav = build_project_nav(entry.name, humanize(entry.name), NavSpec(),
                                    defaults, docs_dir)
            if nav["counts"]["pages"]:
                nav["registered"] = False
                extras.append(nav)

    order = [p.name for p in registry.nav_ordered()]
    return {
        "schema_version": NAV_SCHEMA_VERSION,
        "engine_version": ENGINE_VERSION,
        "order": order,
        "projects": navs,
        "extras": extras,
        "counts": {
            "projects": len(navs),
            "pages": sum(n["counts"]["pages"] for n in navs.values())
            + sum(n["counts"]["pages"] for n in extras),
        },
    }


# --------------------------------------------------------------------------
# renderers
# --------------------------------------------------------------------------

def _yaml_scalar(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)     # JSON scalars are valid YAML


def _render_nav_items(nodes: List[Dict], indent: int) -> List[str]:
    pad = " " * indent
    lines: List[str] = []
    for node in nodes:
        title = _yaml_scalar(node["title"])
        if node["type"] == "page":
            lines.append(f"{pad}- {title}: {node['path']}")
        elif node.get("children"):
            lines.append(f"{pad}- {title}:")
            lines.extend(_render_nav_items(node["children"], indent + 4))
    return lines


def _render_corpus(title: str, tree: Dict, indent: int) -> List[str]:
    """Render one corpus as a nav entry (a lone page needs no section)."""
    pad = " " * indent
    children = tree.get("children") or []
    if len(children) == 1 and children[0]["type"] == "page":
        return [f"{pad}- {_yaml_scalar(title)}: {children[0]['path']}"]
    return [f"{pad}- {_yaml_scalar(title)}:"] + _render_nav_items(children, indent + 4)


def render_mkdocs_nav(fleet: Dict, registry: Registry,
                      docs_dir: Path = DOCS_DIR) -> str:
    """Render nav.yml: the MkDocs `nav` plus the matching `exclude_docs`."""
    lines = [
        "# nav.yml - GENERATED by scripts/context_engine (navigator).",
        "# Do not hand-edit: change _data/projects.yml (the `navigation:` block",
        "# or a project's `nav:`) or the corpus, then run",
        "#   python3 -m scripts.context_engine build",
        "#",
        "# mkdocs.yml pulls this in with `INHERIT`, so the published sidebar is",
        "# always the folder hierarchy of docs/ as the registry groups it.",
        "",
        "# Keep the site's page set identical to the navigation tree: re-include",
        "# the dot-directories MkDocs drops by default (the fleet's skills,",
        "# agents and quests corpora live in them) and drop what the registry",
        "# excludes, so no page is published without a way to navigate to it.",
        "exclude_docs: |",
    ]
    if registry.navigation.publish_hidden:
        lines += ["  !**/.*", "  !**/.*/**"]
    excluded: List[str] = []
    for pattern in registry.navigation.exclude:
        excluded.append(pattern)
    for project in registry.nav_ordered():
        for pattern in project.nav.exclude:
            excluded.append(f"{project.name}/{pattern}")
    for pattern in sorted(set(excluded)):
        lines.append(f"  {pattern}")

    lines += ["", "nav:", '  - "Home": index.md']
    for name in fleet["order"]:
        nav = fleet["projects"].get(name)
        if not nav or not nav["counts"]["pages"]:
            continue
        lines.extend(_render_corpus(nav["title"], nav["tree"], 2))

    if fleet["extras"]:
        lines.append('  - "Reference":')
        for nav in fleet["extras"]:
            lines.extend(_render_corpus(nav["title"], nav["tree"], 6))

    lines.append('  - "Browse":')
    lines.append('      - "Content map": browse/index.md')
    ordered = [fleet["projects"][n] for n in fleet["order"]
               if n in fleet["projects"]] + fleet["extras"]
    for nav in ordered:
        if not nav["counts"]["pages"]:
            continue
        lines.append(
            f"      - {_yaml_scalar(nav['title'])}: browse/{nav['project']}.md")
    lines.append("")
    return "\n".join(lines)


def _browse_lines(nodes: List[Dict], project: str, indent: int = 0) -> List[str]:
    pad = "  " * indent
    lines: List[str] = []
    for node in nodes:
        if node["type"] == "page":
            href = _browse_href(node["path"])
            lines.append(f"{pad}- [{node['title']}]({href})")
        else:
            label = f"**{node['title']}**"
            if node.get("index"):
                label = f"**[{node['title']}]({_browse_href(node['index'])})**"
            lines.append(f"{pad}- {label} <small>({node['pages']})</small>")
            lines.extend(_browse_lines(node["children"], project, indent + 1))
    return lines


def _plural(count: int, noun: str) -> str:
    return f"{count:,} {noun}" + ("" if count == 1 else "s")


def _browse_href(docs_path: str) -> str:
    """Link from docs/browse/*.md to a corpus page."""
    return "../" + docs_path


def render_browse_project(nav: Dict) -> str:
    """docs/browse/<project>.md - the project's whole tree on one page."""
    counts = nav["counts"]
    lines = [
        "---",
        f"title: {json.dumps(nav['title'] + ' - content map')}",
        "description: >-",
        f"  Complete navigable map of the {nav['title']} documentation corpus.",
        "generated: true",
        "nav_exclude: true",
        "---",
        GENERATED_NOTICE,
        "",
        f"# {nav['title']} - content map",
        "",
        f"Every published page in [`{nav['corpus']}/`](../{nav['project']}/) as it "
        f"appears in the sidebar: **{_plural(counts['pages'], 'page')}** across "
        f"**{_plural(counts['sections'], 'section')}** "
        f"(max depth {counts['max_depth']}).",
        "",
    ]
    lines += _browse_lines(nav["tree"]["children"], nav["project"])
    lines.append("")
    return "\n".join(lines)


def render_browse_index(fleet: Dict, registry: Registry) -> str:
    """
    docs/browse/index.md - the fleet content map.

    Prose paragraphs are emitted as single lines: the repo enforces one
    paragraph per line and its CI gate rewrites offenders in place, which
    would leave this file no longer matching what this function renders.
    """
    lines = [
        "---",
        "title: Content map",
        "description: >-",
        "  Every documentation corpus in the bamr87 fleet, with its top-level",
        "  sections and page counts.",
        "generated: true",
        "---",
        GENERATED_NOTICE,
        "",
        "# Content map",
        "",
        f"**{fleet['counts']['pages']:,}** published pages across "
        f"**{fleet['counts']['projects']}** fleet corpora. The left sidebar "
        "mirrors this structure; each map below expands one corpus in full.",
        "",
        "| Corpus | Pages | Sections | Top-level sections |",
        "|---|---:|---:|---|",
    ]
    for name in fleet["order"]:
        nav = fleet["projects"].get(name)
        if not nav or not nav["counts"]["pages"]:
            continue
        tops = ", ".join(
            child["title"] for child in nav["tree"]["children"]
            if child["type"] != "page")[:120] or "—"
        lines.append(
            f"| [{nav['title']}]({nav['project']}.md) | {nav['counts']['pages']:,} "
            f"| {nav['counts']['sections']} | {tops} |")
    lines.append("")

    if fleet["extras"]:
        lines += [
            "## Not in the fleet registry",
            "",
            "Corpora published from `docs/` that no registry entry claims — "
            "they navigate under **Reference**.",
            "",
        ]
        for nav in fleet["extras"]:
            lines.append(f"- **{nav['title']}** — "
                         f"{_plural(nav['counts']['pages'], 'page')} "
                         f"(`{nav['corpus']}/`)")
        lines.append("")

    lines += [
        "## How this is built",
        "",
        "`_data/projects.yml` carries the navigation contract (grouping, depth,"
        " exclusions); `scripts/context_engine/navigator.py` walks the corpus and"
        " renders it to `nav.yml` (this site), `context/nav/*.json` (any other"
        " frontend), and these maps. Rebuild with:",
        "",
        "```bash",
        "python3 -m scripts.context_engine build",
        "```",
        "",
    ]
    return "\n".join(lines)


# --------------------------------------------------------------------------
# writers
# --------------------------------------------------------------------------

def _write_if_changed(path: Path, content: str) -> bool:
    """Write only on a real change so reruns leave a clean git status."""
    old = path.read_text(encoding="utf-8") if path.is_file() else None
    if old == content:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return True


def _prune(directory: Path, keep: Iterable[str], suffix: str) -> None:
    keep = set(keep)
    if not directory.is_dir():
        return
    for stale in directory.glob(f"*{suffix}"):
        if stale.name not in keep:
            stale.unlink()


def _fleet_manifest(fleet: Dict) -> Dict:
    """context/nav/index.json - the fleet navigation manifest."""
    return {
        "schema_version": fleet["schema_version"],
        "engine_version": fleet["engine_version"],
        "order": fleet["order"],
        "counts": fleet["counts"],
        "projects": {
            nav["project"]: {
                "title": nav["title"],
                "corpus": nav["corpus"],
                "tree": f"context/nav/{nav['project']}.json",
                "browse": f"docs/browse/{nav['project']}.md",
                "registered": nav.get("registered", True),
                **nav["counts"],
                "fingerprint": nav["fingerprint"],
            }
            for nav in list(fleet["projects"].values()) + fleet["extras"]
        },
    }


def write_nav_tree(fleet: Dict, nav_dir: Optional[Path] = None,
                   fleet_path: Optional[Path] = None) -> None:
    """Write context/nav/: one tree per corpus plus the fleet manifest."""
    nav_dir = nav_dir or NAV_DIR
    fleet_path = fleet_path or NAV_FLEET_PATH
    nav_dir.mkdir(parents=True, exist_ok=True)
    written: List[str] = []
    for nav in list(fleet["projects"].values()) + fleet["extras"]:
        name = f"{nav['project']}.json"
        _write_if_changed(nav_dir / name,
                          json.dumps(nav, indent=2, sort_keys=False) + "\n")
        written.append(name)

    _write_if_changed(fleet_path, json.dumps(_fleet_manifest(fleet), indent=2) + "\n")
    _prune(nav_dir, written + [fleet_path.name], ".json")


def write_mkdocs_nav(fleet: Dict, registry: Registry,
                     path: Optional[Path] = None) -> bool:
    """Write nav.yml (the MkDocs surface). True when it changed."""
    return _write_if_changed(path or MKDOCS_NAV_PATH,
                             render_mkdocs_nav(fleet, registry))


def write_browse_pages(fleet: Dict, registry: Registry,
                       browse_dir: Optional[Path] = None) -> None:
    """Write docs/browse/: the fleet content map plus one map per corpus."""
    browse_dir = browse_dir or BROWSE_DIR
    browse_dir.mkdir(parents=True, exist_ok=True)
    written = ["index.md"]
    _write_if_changed(browse_dir / "index.md", render_browse_index(fleet, registry))
    for nav in list(fleet["projects"].values()) + fleet["extras"]:
        if not nav["counts"]["pages"]:
            continue
        name = f"{nav['project']}.md"
        _write_if_changed(browse_dir / name, render_browse_project(nav))
        written.append(name)
    _prune(browse_dir, written, ".md")


def nav_surfaces(fleet: Dict, registry: Registry) -> Dict[Path, str]:
    """Every generated navigation surface as path -> intended content."""
    corpora = [fleet["projects"][n] for n in fleet["order"]
               if n in fleet["projects"]] + fleet["extras"]
    surfaces: Dict[Path, str] = {
        MKDOCS_NAV_PATH: render_mkdocs_nav(fleet, registry),
        BROWSE_DIR / "index.md": render_browse_index(fleet, registry),
        NAV_FLEET_PATH: json.dumps(_fleet_manifest(fleet), indent=2) + "\n",
    }
    for nav in corpora:
        surfaces[NAV_DIR / f"{nav['project']}.json"] = \
            json.dumps(nav, indent=2, sort_keys=False) + "\n"
        if nav["counts"]["pages"]:
            surfaces[BROWSE_DIR / f"{nav['project']}.md"] = render_browse_project(nav)
    return surfaces


def check_nav(registry: Registry, docs_dir: Optional[Path] = None) -> List[str]:
    """Read-only drift check: which generated surfaces no longer match the corpus."""
    fleet = build_fleet_nav(registry, docs_dir or DOCS_DIR)
    drifted: List[str] = []
    surfaces = nav_surfaces(fleet, registry)
    for path, content in sorted(surfaces.items()):
        current = path.read_text(encoding="utf-8") if path.is_file() else None
        if current != content:
            drifted.append(f"{'stale' if current is not None else 'missing'}: "
                           f"{_relative(path)}")
    expected = set(surfaces)
    for directory, suffix in ((NAV_DIR, ".json"), (BROWSE_DIR, ".md")):
        if not directory.is_dir():
            continue
        for existing in sorted(directory.glob(f"*{suffix}")):
            if existing not in expected:
                drifted.append(f"orphan: {_relative(existing)}")
    return drifted


def _relative(path: Path) -> str:
    try:
        return path.relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


def navigate(registry: Registry, docs_dir: Optional[Path] = None,
             write_mkdocs: bool = True, write_browse: bool = True) -> Dict:
    """Full navigation stage: build the fleet tree and write every surface."""
    fleet = build_fleet_nav(registry, docs_dir or DOCS_DIR)
    write_nav_tree(fleet)
    if write_mkdocs:
        write_mkdocs_nav(fleet, registry)
    if write_browse:
        write_browse_pages(fleet, registry)
    return fleet
