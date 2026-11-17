"""
The second brain: notes the engine writes about the corpus, under docs/brain/.

The corpus says what each repository documents. These notes say how it fits
together, in the shape the LLM-wiki pattern uses:

  index.md           the catalog: start here
  hot.md             the hot cache: what changed lately, what is most connected
  log.md             the change log, rendered from context/vault/log.jsonl
  health.md          lint: unresolved links, orphans, ambiguous titles
  concepts/<slug>.md one note per subject shared across pages, linking them
  projects/<name>.md one note per repository, linking its key pages and concepts
  notes/*.md         durable notes from `notes/`, copied in unchanged
  fleet.canvas       an Obsidian canvas of projects and their shared concepts
  pages.base         an Obsidian Bases view of the vault

A tag becomes a concept once enough pages carry it; a [[link]] nothing answers
becomes a stub concept once enough pages ask for it. Concepts are what connect
repositories that never link to each other.

Output stays diff-stable: no timestamps, and AI summaries are cached in
context/vault/synthesis.json, so a build with no key reproduces the last one.
"""

import hashlib
import json
import re
import shutil
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import yaml

from .ai import AIError, BaseProvider
from .config import (
    BRAIN_DIR, CHANGE_LOG_PATH, COLLECT_MANIFEST_PATH, DOCS_DIR, GENERATED_NOTICE,
    NOTES_DIR, OBSIDIAN_DIR, SYNTHESIS_PATH,
)
from .registry import Registry
from .vault import Note, norm, parse_note, scan, wikilink_for

MEMBERS_PER_PROJECT = 12
RELATED_LIMIT = 8
HOT_HUBS = 15
LOG_ROWS = 200
HEALTH_ROWS = 60
CANVAS_CONCEPTS = 24

CONCEPT_PROMPT = (
    "Write a two or three sentence summary of what this concept means across "
    "the fleet's documentation, using only the pages listed. Name the projects "
    "involved. Concept: {title}\n\nPages:\n{pages}"
)
# Obsidian stores a graph colour as one integer. Readable on light and dark.
PALETTE = (0x5C6BC0, 0x26A69A, 0xEF6C00, 0xAB47BC, 0x42A5F5, 0x9CCC65, 0xEC407A,
           0xFFCA28, 0x8D6E63, 0x26C6DA, 0xD4E157, 0xFF7043, 0x7E57C2, 0x66BB6A,
           0x29B6F6, 0xFFA726, 0x78909C, 0xBA68C8, 0x4DB6AC, 0xF06292, 0xAED581,
           0x90A4AE, 0xFFD54F, 0x4FC3F7)
CONCEPT_COLOUR = 0xFFD54F


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", norm(text)).strip("-") or "note"


@dataclass
class Concept:
    slug: str
    title: str
    members: List[str] = field(default_factory=list)
    stub: bool = False                     # born from unresolved links, not tags
    aliases: List[str] = field(default_factory=list)
    summary: str = ""

    @property
    def path(self) -> str:
        return f"brain/concepts/{self.slug}.md"


def _display(tag: str) -> str:
    words = re.split(r"[-_ ]+", tag.strip())
    return " ".join(w if any(c.isupper() for c in w) else
                    (w.upper() if len(w) <= 3 else w.capitalize()) for w in words)


def find_concepts(notes: Dict[str, Note], registry: Registry) -> List[Concept]:
    """Subjects worth a note: common tags, and links many pages make to nothing."""
    config = registry.brain
    tagged: Dict[str, List[str]] = defaultdict(list)
    spelled: Dict[str, Counter] = defaultdict(Counter)
    for note in notes.values():
        if note.project == "brain":
            continue
        for tag in note.tags:
            key = tag.lower().strip("#")
            if key in config.concept_stop or "/" in key:
                continue
            key = config.concept_aliases.get(key, key)
            slug = slugify(key)
            tagged[slug].append(note.path)
            spelled[slug][tag] += 1

    concepts: Dict[str, Concept] = {}
    for slug, members in tagged.items():
        unique = sorted(set(members))
        if len(unique) >= config.concept_min_pages:
            concepts[slug] = Concept(slug=slug, members=unique,
                                     title=_display(spelled[slug].most_common(1)[0][0]),
                                     aliases=sorted(spelled[slug]))

    asked: Dict[str, Tuple[str, List[str]]] = {}
    for note in notes.values():
        if note.project == "brain":
            continue
        for target in note.unresolved:
            slug = slugify(target)
            title, members = asked.setdefault(slug, (target, []))
            members.append(note.path)
    for slug, (title, members) in asked.items():
        unique = sorted(set(members))
        if slug in concepts:
            concepts[slug].members = sorted(set(concepts[slug].members) | set(unique))
            concepts[slug].aliases = sorted(set(concepts[slug].aliases) | {title})
        elif len(unique) >= config.concept_min_links:
            concepts[slug] = Concept(slug=slug, title=title, members=unique,
                                     stub=True, aliases=[title])

    # Cross-repository subjects first: connecting repositories is the point.
    def rank(concept: Concept) -> Tuple[int, int, str]:
        projects = {notes[m].project for m in concept.members}
        return (-len(projects), -len(concept.members), concept.slug)

    # Stubs get their own share of the cap: they are single-project by nature
    # and would otherwise always lose to tags, yet they are the to-do list.
    ranked = sorted(concepts.values(), key=rank)
    stubs = [c for c in ranked if c.stub][: config.concept_max // 5]
    tags = [c for c in ranked if not c.stub][: config.concept_max - len(stubs)]
    return sorted(tags + stubs, key=rank)


def _related(concepts: List[Concept]) -> Dict[str, List[Tuple[str, int]]]:
    """Concepts that share pages, by how many."""
    by_page: Dict[str, List[str]] = defaultdict(list)
    for concept in concepts:
        for member in concept.members:
            by_page[member].append(concept.slug)
    shared: Dict[Tuple[str, str], int] = Counter()
    for slugs in by_page.values():
        for i, a in enumerate(slugs):
            for b in slugs[i + 1:]:
                shared[tuple(sorted((a, b)))] += 1
    related: Dict[str, List[Tuple[str, int]]] = defaultdict(list)
    for (a, b), count in shared.items():
        if count >= 2:
            related[a].append((b, count))
            related[b].append((a, count))
    return {slug: sorted(rows, key=lambda r: (-r[1], r[0]))[:RELATED_LIMIT]
            for slug, rows in related.items()}


def _fingerprint(concept: Concept) -> str:
    return hashlib.sha256("\n".join(concept.members).encode("utf-8")).hexdigest()[:12]


def _heuristic_summary(concept: Concept, notes: Dict[str, Note],
                       titles: Dict[str, str]) -> str:
    projects = Counter(notes[m].project for m in concept.members)
    named = ", ".join(titles.get(p, p) for p, _ in projects.most_common(4))
    pages = len(concept.members)
    lead = (f"{pages} page{'s' if pages != 1 else ''} across "
            f"{len(projects)} project{'s' if len(projects) != 1 else ''} ({named})")
    verb = "link to this subject, but no page defines it yet." if concept.stub \
        else "cover this subject."
    return f"{lead} {verb}"


def summarize_concepts(concepts: List[Concept], notes: Dict[str, Note],
                       titles: Dict[str, str], ai: Optional[BaseProvider], budget: int,
                       cache_path: Path = SYNTHESIS_PATH) -> int:
    """Fill each summary from the cache, then the AI budget, then the heuristic.

    A cached summary outlives a change in its members: stale prose is still
    grounded, and it is refreshed when the budget reaches it.
    """
    cache: Dict[str, Dict] = {}
    if cache_path.is_file():
        cache = json.loads(cache_path.read_text(encoding="utf-8"))
    spent = 0
    for concept in concepts:
        entry = cache.get(concept.slug)
        print_key = _fingerprint(concept)
        if ai is not None and spent < budget and (not entry or entry["members"] != print_key):
            ranked = sorted(concept.members, key=lambda m: (-len(notes[m].links), m))[:20]
            pages = "\n".join(f"- {notes[m].title} ({titles.get(notes[m].project, notes[m].project)})"
                              f": {notes[m].summary}" for m in ranked)
            try:
                text = ai.complete(CONCEPT_PROMPT.format(title=concept.title, pages=pages),
                                   max_tokens=400)
            except AIError as exc:
                print(f"[brain] AI summary skipped for {concept.slug}: {exc}")
            else:
                entry = cache[concept.slug] = {"members": print_key, "text": text.strip(),
                                               "model": ai.model}
                spent += 1
        concept.summary = entry["text"] if entry else _heuristic_summary(concept, notes, titles)
    if spent:
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        cache_path.write_text(json.dumps(cache, indent=2, sort_keys=True, ensure_ascii=False)
                              + "\n", encoding="utf-8")
    return spent


def _front(**meta) -> str:
    head = yaml.dump({**meta, "generated": True}, sort_keys=True, allow_unicode=True,
                     default_flow_style=False)
    return f"---\n{head}---\n{GENERATED_NOTICE}\n\n"


def _link(notes: Dict[str, Note], path: str, label: Optional[str] = None) -> str:
    title = (label or notes[path].title).replace("|", "-").replace("[", "(").replace("]", ")")
    return wikilink_for(path, title)


def render_concept(concept: Concept, notes: Dict[str, Note], titles: Dict[str, str],
                   related: List[Tuple[str, int]], by_slug: Dict[str, Concept]) -> str:
    groups: Dict[str, List[str]] = defaultdict(list)
    for member in concept.members:
        groups[notes[member].project].append(member)
    lines = [_front(title=concept.title, aliases=concept.aliases, kind="concept",
                    tags=["brain/stub" if concept.stub else "brain/concept"],
                    pages=len(concept.members), projects=len(groups)),
             f"# {concept.title}\n", "> [!abstract] Summary",
             f"> {' '.join(concept.summary.split())}\n"]
    if concept.stub:
        lines += ["> [!todo] Stub",
                  "> Pages link here but nothing defines this yet. Write it in the owning "
                  "repository, or as a note in `notes/`.\n"]
    lines.append("## Across the fleet\n")
    for project in sorted(groups, key=lambda p: (-len(groups[p]), p)):
        members = sorted(groups[project], key=lambda m: (-len(notes[m].links), m))
        lines.append(f"### {wikilink_for(f'brain/projects/{project}.md', titles.get(project, project))}"
                     f" ({len(members)})\n")
        lines += [f"- {_link(notes, m)}" for m in members[:MEMBERS_PER_PROJECT]]
        if len(members) > MEMBERS_PER_PROJECT:
            lines.append(f"- and {len(members) - MEMBERS_PER_PROJECT} more")
        lines.append("")
    if related:
        lines.append("## Related concepts\n")
        lines += [f"- {wikilink_for(by_slug[slug].path, by_slug[slug].title)} "
                  f"({count} shared pages)" for slug, count in related]
        lines.append("")
    return "\n".join(lines)


def render_project(name: str, registry: Registry, notes: Dict[str, Note],
                   concepts: List[Concept], titles: Dict[str, str],
                   neighbours: List[Tuple[str, int]], status: Dict) -> str:
    project = registry.get(name)
    pages = [n for n in notes.values() if n.project == name]
    hubs = sorted(pages, key=lambda n: (-len(n.links), n.path))[:12]
    mine = sorted(((sum(1 for m in c.members if notes[m].project == name), c)
                   for c in concepts), key=lambda r: (-r[0], r[1].slug))
    mine = [(count, c) for count, c in mine if count][:20]
    lines = [_front(title=titles[name], kind="project", tags=["brain/project"],
                    repo=project.repo, pages=len(pages)),
             f"# {titles[name]}\n", f"> [!info] {project.kind}: `{project.repo}`",
             f"> {project.description or 'No description in the registry.'}\n",
             f"**{len(pages)}** pages collected"
             + (f" from commit `{status['commit'][:12]}` ({status['commit_date']})."
                if status.get("commit") else ".") + "\n"]
    if status.get("status") == "frozen":
        lines += ["> [!warning] Frozen",
                  "> The last crawl could not reach this repository, so these pages may be stale.\n"]
    if hubs:
        lines.append("## Most connected pages\n")
        lines += [f"- {_link(notes, n.path)}" for n in hubs]
        lines.append("")
    if mine:
        lines.append("## Concepts\n")
        lines += [f"- {wikilink_for(c.path, c.title)} ({count})" for count, c in mine]
        lines.append("")
    if neighbours:
        lines.append("## Shares concepts with\n")
        lines += [f"- {wikilink_for(f'brain/projects/{other}.md', titles.get(other, other))} "
                  f"({count})" for other, count in neighbours]
        lines.append("")
    return "\n".join(lines)


def _project_neighbours(concepts: List[Concept], notes: Dict[str, Note],
                        known: Dict[str, str]) -> Dict[str, List[Tuple[str, int]]]:
    pairs: Counter = Counter()
    for concept in concepts:
        projects = sorted({notes[m].project for m in concept.members} & set(known))
        for i, a in enumerate(projects):
            for b in projects[i + 1:]:
                pairs[(a, b)] += 1
    rows: Dict[str, List[Tuple[str, int]]] = defaultdict(list)
    for (a, b), count in pairs.items():
        rows[a].append((b, count))
        rows[b].append((a, count))
    return {k: sorted(v, key=lambda r: (-r[1], r[0]))[:RELATED_LIMIT] for k, v in rows.items()}


def read_log(path: Path = CHANGE_LOG_PATH) -> List[Dict]:
    if not path.is_file():
        return []
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines()
            if line.strip()]


def render_log(log: List[Dict], titles: Dict[str, str]) -> str:
    lines = [_front(title="Change log", kind="map", tags=["brain/map"]), "# Change log\n",
             "Every crawl that changed a corpus, newest first. Dates are the upstream "
             "commit date.\n", "| Date | Project | Commit | Added | Changed | Removed |",
             "|---|---|---|---:|---:|---:|"]
    for row in list(reversed(log))[:LOG_ROWS]:
        project = row["project"]
        lines.append(f"| {row['date']} | {wikilink_for(f'brain/projects/{project}.md', titles.get(project, project), in_table=True)} "
                     f"| `{row['commit']}` | {row.get('added', 0)} | {row.get('changed', 0)} "
                     f"| {row.get('removed', 0)} |")
    return "\n".join(lines) + "\n"


def render_hot(notes: Dict[str, Note], log: List[Dict], titles: Dict[str, str],
               incoming: Counter, manifest: Dict, concepts: List[Concept]) -> str:
    """The hot cache: the first note an agent reads to catch up."""
    lines = [_front(title="Hot cache", kind="map", tags=["brain/map"]), "# Hot cache\n",
             "Read this first. It holds what moved lately and what everything else "
             "connects through.\n"]
    frozen = sorted(n for n, e in manifest.items() if e.get("status") == "frozen")
    if frozen:
        lines += ["> [!warning] Unreachable sources",
                  f"> The last crawl could not reach: {', '.join(frozen)}.\n"]
    lines.append("## Recent changes\n")
    seen = set()
    for row in reversed(log):
        if row["project"] in seen or len(seen) >= 10:
            continue
        seen.add(row["project"])
        project = row["project"]
        lines.append(f"- {row['date']} {wikilink_for(f'brain/projects/{project}.md', titles.get(project, project))}: "
                     f"+{row.get('added', 0)} ~{row.get('changed', 0)} -{row.get('removed', 0)}")
        for sample in row.get("sample", [])[:3]:
            path = f"{project}/{sample}"
            if path in notes:
                lines.append(f"    - {_link(notes, path)}")
    if not seen:
        lines.append("No crawl has been logged yet.")
    lines.append("\n## Most linked pages\n")
    hubs = [p for p, _ in sorted(incoming.items(), key=lambda r: (-r[1], r[0]))
            if notes[p].project != "brain"][:HOT_HUBS]
    lines += [f"- {_link(notes, p)} ({incoming[p]} links in)" for p in hubs]
    lines.append("\n## Cross-repository concepts\n")
    lines += [f"- {wikilink_for(c.path, c.title)} "
              f"({len({notes[m].project for m in c.members})} projects)"
              for c in concepts[:HOT_HUBS]]
    return "\n".join(lines) + "\n"


def render_health(notes: Dict[str, Note], unresolved: Dict[str, List[str]],
                  incoming: Counter) -> str:
    orphans = sorted(p for p, n in notes.items()
                     if not n.links and not incoming[p] and n.project != "brain")
    duplicates: Dict[str, List[str]] = defaultdict(list)
    for note in notes.values():
        if note.project != "brain":
            duplicates[norm(note.title)].append(note.path)
    ambiguous = {k: v for k, v in duplicates.items() if len(v) > 1 and k}
    lines = [_front(title="Vault health", kind="map", tags=["brain/map"]), "# Vault health\n",
             f"**{len(unresolved)}** unresolved link targets, **{len(orphans)}** orphan pages, "
             f"**{len(ambiguous)}** titles shared by more than one page. Fix these upstream: "
             "`docs/` is regenerated.\n", "## Unresolved links\n",
             "| Target | Pages asking |", "|---|---:|"]
    rows = sorted(unresolved.items(), key=lambda r: (-len(r[1]), r[0]))[:HEALTH_ROWS]
    lines += ["| `{}` | {} |".format(t.replace("|", "\\|"), len(s)) for t, s in rows]
    counts = Counter(p.split("/")[0] for p in orphans)
    lines += ["", "## Orphans by project\n", "| Project | Orphan pages |", "|---|---:|"]
    lines += [f"| {p} | {c} |" for p, c in counts.most_common()]
    lines += ["", "## Most repeated titles\n", "| Title | Pages |", "|---|---:|"]
    top = sorted(ambiguous.items(), key=lambda r: (-len(r[1]), r[0]))[:HEALTH_ROWS]
    lines += [f"| {notes[v[0]].title.replace('|', '-')} | {len(v)} |" for _, v in top]
    return "\n".join(lines) + "\n"


def render_index(concepts: List[Concept], names: List[str], titles: Dict[str, str],
                 notes: Dict[str, Note], own_notes: List[str]) -> str:
    lines = [_front(title="Second Brain", kind="map", tags=["brain/map"]), "# Second Brain\n",
             "The fleet's documentation as one linked knowledge base. Open `docs/` as a vault "
             "in Obsidian, or use the views here.\n",
             "| View | What it shows |", "|---|---|",
             "| [[brain/graph\\|Graph view]] | Every note and link |",
             "| [[brain/canvas\\|Canvas]] | Projects and the concepts they share |",
             "| [[brain/pages\\|All pages]] | A sortable table of the vault |",
             "| [[brain/tags\\|Tags]] | Every tag, by use |",
             "| [[brain/hot\\|Hot cache]] | What changed, what is most connected |",
             "| [[brain/log\\|Change log]] | Every crawl that changed a corpus |",
             "| [[brain/health\\|Vault health]] | Broken links, orphans, repeated titles |", "",
             "## Projects\n"]
    lines += [f"- {wikilink_for(f'brain/projects/{n}.md', titles[n])}" for n in names]
    if own_notes:
        lines.append("\n## Notes\n")
        lines += [f"- {_link(notes, p)}" for p in own_notes]
    lines.append("\n## Concepts\n")
    lines += [f"- {wikilink_for(c.path, c.title)} ({len(c.members)})"
              for c in sorted(concepts, key=lambda c: c.slug)]
    return "\n".join(lines) + "\n"


def render_tags(notes: Dict[str, Note], concepts: List[Concept]) -> str:
    counts: Counter = Counter()
    for note in notes.values():
        if note.project != "brain":
            counts.update(t.lower() for t in note.tags)
    homes = {alias.lower(): c for c in concepts for alias in c.aliases}
    lines = [_front(title="Tags", kind="map", tags=["brain/map"]), "# Tags\n",
             f"**{len(counts)}** tags. A linked tag has a concept note.\n",
             "| Tag | Pages |", "|---|---:|"]
    for tag, count in sorted(counts.items(), key=lambda r: (-r[1], r[0])):
        label = tag.replace("|", "-")
        cell = (wikilink_for(homes[tag].path, label, in_table=True) if tag in homes
                else f"`{label}`")
        lines.append(f"| {cell} | {count} |")
    return "\n".join(lines) + "\n"


def _view(title: str, intro: str, html: str) -> str:
    return _front(title=title, kind="map", tags=["brain/map"], hide=["toc"]) \
        + f"# {title}\n\n{intro}\n\n{html}\n"


def render_canvas(names: List[str], titles: Dict[str, str], concepts: List[Concept],
                  notes: Dict[str, Note]) -> str:
    """JSON Canvas: projects on an outer ring, shared concepts inside it."""
    import math
    nodes: List[Dict] = []
    edges: List[Dict] = []
    width, height = 260, 70
    for i, name in enumerate(names):
        angle = 2 * math.pi * i / max(len(names), 1)
        nodes.append({"id": f"p-{slugify(name)}", "type": "file",
                      "file": f"brain/projects/{name}.md", "color": "5",
                      "x": round(1500 * math.cos(angle)) - width // 2,
                      "y": round(1100 * math.sin(angle)) - height // 2,
                      "width": width, "height": height})
    shared = [c for c in concepts if len({notes[m].project for m in c.members}) >= 2]
    for i, concept in enumerate(shared[:CANVAS_CONCEPTS]):
        angle = 2 * math.pi * i / max(min(len(shared), CANVAS_CONCEPTS), 1)
        radius = 420 if i % 2 else 760
        nodes.append({"id": f"c-{concept.slug}", "type": "file", "file": concept.path,
                      "color": "4", "x": round(radius * math.cos(angle)) - 110,
                      "y": round(radius * 0.75 * math.sin(angle)) - 30,
                      "width": 220, "height": 60})
        for project in sorted({notes[m].project for m in concept.members} & set(names)):
            edges.append({"id": f"e-{concept.slug}-{slugify(project)}",
                          "fromNode": f"c-{concept.slug}",
                          "toNode": f"p-{slugify(project)}"})
    return json.dumps({"nodes": nodes, "edges": edges}, indent=1, sort_keys=True) + "\n"


def render_base() -> str:
    return yaml.dump({
        "filters": {"and": ['file.ext == "md"']},
        "views": [
            {"type": "table", "name": "All pages",
             "order": ["file.name", "title", "source_repo", "tags"]},
            {"type": "table", "name": "Concepts",
             "filters": {"and": ['kind == "concept"']},
             "order": ["file.name", "pages", "projects"]},
            {"type": "table", "name": "Projects",
             "filters": {"and": ['kind == "project"']},
             "order": ["file.name", "repo", "pages"]},
        ],
    }, sort_keys=False)


def obsidian_settings(names: List[str]) -> Dict[str, str]:
    """docs/.obsidian: graph colour groups, one per project, and core plugins."""
    groups = [{"query": "path:brain/concepts", "color": {"a": 1, "rgb": CONCEPT_COLOUR}}]
    groups += [{"query": f'path:"{name}/"',
                "color": {"a": 1, "rgb": PALETTE[i % len(PALETTE)]}}
               for i, name in enumerate(names)]
    dump = lambda value: json.dumps(value, indent=2, sort_keys=True) + "\n"  # noqa: E731
    return {
        "app.json": dump({"alwaysUpdateLinks": False, "newLinkFormat": "absolute",
                          "useMarkdownLinks": False, "userIgnoreFilters": ["results/"]}),
        "core-plugins.json": dump(["backlink", "bases", "canvas", "command-palette",
                                   "file-explorer", "global-search", "graph",
                                   "outgoing-link", "outline", "page-preview", "properties",
                                   "switcher", "tag-pane"]),
        "graph.json": dump({"colorGroups": groups, "showOrphans": False, "showTags": False,
                            "centerStrength": 0.5, "linkDistance": 120,
                            "linkStrength": 1, "repelStrength": 12, "scale": 0.4}),
    }


def _project_titles(registry: Registry, notes: Dict[str, Note]) -> Dict[str, str]:
    titles = {p.name: p.nav_title for p in registry.active()}
    for note in notes.values():
        titles.setdefault(note.project, note.project)
    return titles


def _copy_own_notes(notes_dir: Path, brain_dir: Path) -> None:
    if not notes_dir.is_dir():
        return
    for path in sorted(notes_dir.rglob("*.md")):
        if path.name in ("README.md", "SCHEMA.md"):
            continue
        target = brain_dir / "notes" / path.relative_to(notes_dir)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(path, target)


def save_note(title: str, body: str, tags: Optional[List[str]] = None,
              sources: Optional[List[str]] = None, notes_dir: Path = NOTES_DIR) -> Path:
    """File an answer worth keeping. The next build publishes it into the vault."""
    path = notes_dir / f"{slugify(title)}.md"
    if path.exists():
        raise ValueError(f"{path.name} already exists: edit it instead")
    meta = {"title": title, "kind": "note", "tags": ["brain/note", *(tags or [])]}
    if sources:
        meta["sources"] = sources
    head = yaml.dump(meta, sort_keys=False, allow_unicode=True, default_flow_style=False)
    related = "".join(f"\n- [[{source}]]" for source in sources or [])
    tail = f"\n\n## Sources\n{related}\n" if related else "\n"
    notes_dir.mkdir(parents=True, exist_ok=True)
    path.write_text(f"---\n{head}---\n\n# {title}\n\n{body.strip()}{tail}", encoding="utf-8")
    return path


def generate(registry: Registry, ai: Optional[BaseProvider] = None,
             docs_dir: Path = DOCS_DIR, brain_dir: Optional[Path] = None,
             notes_dir: Path = NOTES_DIR, obsidian_dir: Optional[Path] = None,
             cache_path: Path = SYNTHESIS_PATH, log_path: Path = CHANGE_LOG_PATH,
             manifest_path: Path = COLLECT_MANIFEST_PATH) -> Dict:
    """Regenerate docs/brain/ from the corpus. Returns a summary."""
    brain_dir = brain_dir or (BRAIN_DIR if docs_dir == DOCS_DIR else docs_dir / "brain")
    obsidian_dir = obsidian_dir or (OBSIDIAN_DIR if docs_dir == DOCS_DIR
                                    else docs_dir / ".obsidian")
    shutil.rmtree(brain_dir, ignore_errors=True)
    _copy_own_notes(notes_dir, brain_dir)

    notes, _ = scan(docs_dir)
    unresolved: Dict[str, List[str]] = defaultdict(list)
    incoming: Counter = Counter()
    for note in notes.values():
        incoming.update(note.links)
        for target in note.unresolved:
            unresolved[target].append(note.path)
    titles = _project_titles(registry, notes)
    manifest = (json.loads(manifest_path.read_text(encoding="utf-8"))
                if manifest_path.is_file() else {})
    names = [p.name for p in registry.nav_ordered() if (docs_dir / p.name).is_dir()]

    concepts = find_concepts(notes, registry)
    spent = summarize_concepts(concepts, notes, titles, ai, registry.brain.ai_budget, cache_path)
    related = _related(concepts)
    by_slug = {c.slug: c for c in concepts}
    neighbours = _project_neighbours(concepts, notes, {n: "" for n in names})
    log = read_log(log_path)
    own = sorted(p for p in notes if p.startswith("brain/notes/"))

    files: Dict[str, str] = {
        "index.md": render_index(concepts, names, titles, notes, own),
        "hot.md": render_hot(notes, log, titles, incoming, manifest, concepts),
        "log.md": render_log(log, titles),
        "health.md": render_health(notes, dict(unresolved), incoming),
        "tags.md": render_tags(notes, concepts),
        "graph.md": _view("Graph view", "Every note in the vault and every link between them. "
                          "Drag to pan, scroll to zoom, click a node to open it.",
                          '<div class="brain-view" data-brain-view="graph"></div>'),
        "canvas.md": _view("Canvas", "Projects and the concepts they share. The same board "
                           "opens in Obsidian as `brain/fleet.canvas`.",
                           '<div class="brain-view" data-brain-view="canvas"></div>'),
        "pages.md": _view("All pages", "Every note in the vault. Obsidian shows the same "
                          "data through `brain/pages.base`.",
                          '<div class="brain-view" data-brain-view="table"></div>'),
        "fleet.canvas": render_canvas(names, titles, concepts, notes),
        "pages.base": render_base(),
    }
    for concept in concepts:
        files[f"concepts/{concept.slug}.md"] = render_concept(
            concept, notes, titles, related.get(concept.slug, []), by_slug)
    for name in names:
        files[f"projects/{name}.md"] = render_project(
            name, registry, notes, concepts, titles, neighbours.get(name, []),
            manifest.get(name, {}))
    for rel, content in files.items():
        target = brain_dir / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")

    obsidian_dir.mkdir(parents=True, exist_ok=True)
    for name, content in obsidian_settings(names).items():
        (obsidian_dir / name).write_text(content, encoding="utf-8")
    return {"concepts": len(concepts), "projects": len(names), "ai_summaries": spent,
            "stubs": sum(1 for c in concepts if c.stub)}
