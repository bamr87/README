"""
The site's pictures of the vault, computed at build time with no browser and
no dependency: the colour of each repository, the constellation layout the
graph opens on, and the Atlas, a sunburst of every corpus's navigation drawn
as plain SVG. The MkDocs hook calls these; they never import MkDocs, so the
unit suite tests them without the site dependencies.

Everything here is deterministic: the same graph and navigation give the same
coordinates and the same SVG, byte for byte.
"""

import html
import math
from collections.abc import Callable, Sequence

from scripts.context_engine.brain import CONCEPT_COLOUR, PALETTE

GOLDEN_ANGLE = math.pi * (3 - math.sqrt(5))
NODE_GAP = 10.0      # graph units between neighbouring notes on a spiral
SECTION_GAP = 14.0   # between two sections of one repository
PROJECT_GAP = 60.0   # between two repositories
NEUTRAL = "#b0b0b0"  # notes that belong to no registered repository
HUB = "brain"        # the generated notes: concepts sit at the centre, bridging repositories


def hex_colour(rgb: int) -> str:
    return f"#{rgb:06x}"


def colours(order: Sequence[str]) -> dict[str, str]:
    """One colour per repository, in registry order: the same as Obsidian's colour groups."""
    return {name: hex_colour(PALETTE[i % len(PALETTE)]) for i, name in enumerate(order)}


CONCEPT = hex_colour(CONCEPT_COLOUR)


# --------------------------------------------------------------------------- #
# Constellation layout
# --------------------------------------------------------------------------- #
def spiral(count: int, gap: float = NODE_GAP) -> list[tuple[float, float]]:
    """A sunflower (Vogel) spiral: even spacing, the first points at the centre."""
    return [(gap * math.sqrt(i + 0.5) * math.cos(i * GOLDEN_ANGLE),
             gap * math.sqrt(i + 0.5) * math.sin(i * GOLDEN_ANGLE)) for i in range(count)]


def spiral_radius(count: int, gap: float = NODE_GAP) -> float:
    return gap * math.sqrt(max(count, 1) + 0.5)


def pack(radii: Sequence[float], gap: float) -> list[tuple[float, float]]:
    """Place circles in the given order: the first at the origin, each next one
    touching an earlier one at the free spot nearest the origin."""
    placed: list[tuple[float, float, float]] = []
    for r in radii:
        if not placed:
            placed.append((0.0, 0.0, r))
            continue
        best: tuple[float, float, float] | None = None
        for cx, cy, cr in placed:
            reach = cr + r + gap
            for step in range(72):
                angle = 2 * math.pi * step / 72
                x, y = cx + reach * math.cos(angle), cy + reach * math.sin(angle)
                if all(math.hypot(x - px, y - py) >= pr + r + gap - 1e-6 for px, py, pr in placed):
                    distance = math.hypot(x, y)
                    if best is None or distance < best[0] - 1e-9:
                        best = (distance, x, y)
        assert best is not None  # the ring around the last circle always has room
        placed.append((best[1], best[2], r))
    return [(x, y) for x, y, _ in placed]


def _enclosing(centres: Sequence[tuple[float, float]], radii: Sequence[float]) -> tuple[float, float, float]:
    """A circle around packed circles: centred on their centroid, reaching the farthest edge."""
    cx = sum(x for x, _ in centres) / len(centres)
    cy = sum(y for _, y in centres) / len(centres)
    return cx, cy, max(math.hypot(x - cx, y - cy) + r for (x, y), r in zip(centres, radii, strict=True))


def section_of(path: str, project: str) -> str:
    """The first folder of a note inside its repository's corpus; '' for top-level pages."""
    rel = path[len(project) + 1:] if project and path.startswith(project + "/") else path
    return rel.split("/", 1)[0] if "/" in rel else ""


def constellation(nodes: Sequence[dict], degree: Sequence[int]) -> dict:
    """
    Where each note starts: repositories packed around the generated notes, each
    repository's folders packed inside it, and each folder's notes on a spiral with
    the most linked at its centre. `nodes` need `path` and `project`; `degree`
    counts each note's links. Returns `positions` (one (x, y) per node) and
    `clusters` (one circle per repository, for the labels and halos).
    """
    groups: dict[str, dict[str, list[int]]] = {}
    for i, node in enumerate(nodes):
        project = node.get("project") or ""
        groups.setdefault(project, {}).setdefault(section_of(node["path"], project), []).append(i)

    def project_key(name: str) -> tuple:
        return (name != HUB, -sum(len(m) for m in groups[name].values()), name)

    def section_key(item: tuple[str, list[int]]) -> tuple:
        name, members = item
        return (name != "", -len(members), name)

    local: dict[str, tuple[list[tuple[str, list[int], tuple[float, float]]], tuple[float, float, float]]] = {}
    for project, sections in groups.items():
        ordered = sorted(sections.items(), key=section_key)
        radii = [spiral_radius(len(members)) for _, members in ordered]
        centres = pack(radii, SECTION_GAP)
        local[project] = ([(name, members, c) for (name, members), c in zip(ordered, centres, strict=True)],
                          _enclosing(centres, radii))

    names = sorted(groups, key=project_key)
    outer = [local[name][1][2] for name in names]
    placed = pack(outer, PROJECT_GAP)

    positions: list[tuple[float, float]] = [(0.0, 0.0)] * len(nodes)
    clusters: list[dict] = []
    for name, (px, py), radius in zip(names, placed, outer, strict=True):
        sections, (ex, ey, _) = local[name]
        for _section, members, (sx, sy) in sections:
            members = sorted(members, key=lambda i: (-degree[i], nodes[i]["path"]))
            for i, (dx, dy) in zip(members, spiral(len(members)), strict=True):
                positions[i] = (round(px - ex + sx + dx, 1), round(py - ey + sy + dy, 1))
        clusters.append({"p": name, "x": round(px, 1), "y": round(py, 1), "r": round(radius, 1),
                         "n": sum(len(m) for _, m, _ in sections)})
    return {"positions": positions, "clusters": clusters}


# --------------------------------------------------------------------------- #
# The Atlas: navigation as a sunburst
# --------------------------------------------------------------------------- #
def _mix(colour: str, towards: str, amount: float) -> str:
    a = [int(colour[i:i + 2], 16) for i in (1, 3, 5)]
    b = [int(towards[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join(f"{round(x + (y - x) * amount):02x}" for x, y in zip(a, b, strict=True))


def _pages_under(node: dict) -> list[str]:
    out: list[str] = []
    for child in node.get("children") or []:
        if child.get("type") == "page":
            out.append(child["path"])
        else:
            out.extend(_pages_under(child))
    return out


def tree_items(node: dict, link: Callable[[str], str | None], trail: str) -> list[dict]:
    """One item per sub-section of a navigation node, plus one for the pages directly in it."""
    items: list[dict] = []
    loose = [c["path"] for c in node.get("children") or [] if c.get("type") == "page"]
    for child in node.get("children") or []:
        if child.get("type") == "page":
            continue
        pages = _pages_under(child)
        if not pages:
            continue
        label = f"{trail} › {child.get('title', '')}"
        target = child.get("index") or pages[0]
        items.append({"label": label, "pages": len(pages), "href": link(target),
                      "children": tree_items(child, link, label)})
    if loose and items:
        target = node.get("index") or loose[0]
        items.append({"label": f"{trail} › pages", "pages": len(loose), "href": link(target), "children": []})
    return items


def _point(c: float, r: float, angle: float) -> str:
    return f"{c + r * math.sin(angle):.2f} {c - r * math.cos(angle):.2f}"


def _arc(c: float, r0: float, r1: float, a0: float, a1: float) -> str:
    a1 = min(a1, a0 + 2 * math.pi - 1e-4)
    large = 1 if a1 - a0 > math.pi else 0
    return (f"M{_point(c, r1, a0)}A{r1:.2f} {r1:.2f} 0 {large} 1 {_point(c, r1, a1)}"
            f"L{_point(c, r0, a1)}A{r0:.2f} {r0:.2f} 0 {large} 0 {_point(c, r0, a0)}Z")


def sunburst(items: Sequence[dict], *, title: str, subtitle: str, size: int = 640,
             rings: int = 3, labels: bool = True) -> str:
    """
    A sunburst of `items` (each with `label`, `pages`, `href`, `colour` and
    `children`): the first ring is the items themselves, each further ring their
    children, every wedge sized by its page count and linked to its section.
    """
    c = size / 2
    hole = size * 0.16
    band = (c - 6 - hole) / rings
    arcs: list[str] = []
    texts: list[str] = []
    pad = 0.0025

    def draw(level: list[dict], depth: int, start: float, span: float, colour: str | None) -> None:
        if depth >= rings or not level:
            return
        scale = span / max(sum(i["pages"] for i in level), 1)
        cursor = start
        for n, item in enumerate(level):
            width = item["pages"] * scale
            base = item.get("colour") or colour or NEUTRAL
            fill = base if depth == 0 else _mix(base, "#ffffff", 0.22 + 0.16 * depth + (0.08 if n % 2 else 0))
            r0, r1 = hole + depth * band, hole + (depth + 1) * band - 1.2
            a0, a1 = cursor + pad, cursor + width - pad
            if a1 > a0:
                tip = f"{item['label']} · {item['pages']} page{'s' if item['pages'] != 1 else ''}"
                path = (f'<path class="atlas-arc" d="{_arc(c, r0, r1, a0, a1)}" fill="{fill}" '
                        f'data-label="{html.escape(tip)}"><title>{html.escape(tip)}</title></path>')
                # xlink:href, not href: Material's instant navigation rewrites every [href] with
                # `el.href = el.href`, which throws on an SVG link, whose href is read-only.
                arcs.append(f'<a xlink:href="{html.escape(item["href"])}">{path}</a>' if item.get("href") else path)
                if labels and depth == 0 and a1 - a0 > 0.11:
                    mid = (a0 + a1) / 2
                    radius = (r0 + r1) / 2
                    x, y = c + radius * math.sin(mid), c - radius * math.cos(mid)
                    turn = math.degrees(mid) - 90
                    if math.pi < mid < 2 * math.pi:
                        turn += 180
                    name = item["label"].split(" › ")[-1]
                    room = int((r1 - r0) / 5.2)
                    if len(name) > room:
                        name = name[:max(room - 1, 3)] + "…"
                    texts.append(f'<text class="atlas-label" x="{x:.2f}" y="{y:.2f}" '
                                 'text-anchor="middle" dominant-baseline="central" '
                                 f'transform="rotate({turn:.1f} {x:.2f} {y:.2f})">{html.escape(name)}</text>')
            draw(item.get("children") or [], depth + 1, cursor, width, base)
            cursor += width

    draw(list(items), 0, 0.0, 2 * math.pi, None)
    return (f'<svg class="atlas" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'viewBox="0 0 {size} {size}" role="img" '
            f'aria-label="{html.escape(title)}: {html.escape(subtitle)}">'
            + "".join(arcs) + "".join(texts)
            + f'<text class="atlas-centre" x="{c}" y="{c - 6}" text-anchor="middle">{html.escape(title)}</text>'
            + f'<text class="atlas-sub" x="{c}" y="{c + 14}" text-anchor="middle">{html.escape(subtitle)}</text>'
            + "</svg>")


def fleet_atlas(trees: Sequence[tuple[str, dict]], palette: dict[str, str],
                link: Callable[[str], str | None]) -> str:
    """Every corpus: repositories inside, their sections and sub-sections outside."""
    items = []
    for name, nav in trees:
        tree = nav.get("tree") or {}
        pages = _pages_under(tree)
        if not pages:
            continue
        title = nav.get("title") or name
        items.append({"label": title, "pages": len(pages), "colour": palette.get(name, NEUTRAL),
                      "href": link(tree.get("index") or pages[0]),
                      "children": tree_items(tree, link, title)})
    pages = sum(i["pages"] for i in items)
    return sunburst(items, title=f"{pages:,} pages", subtitle=f"{len(items)} repositories")


def project_emblem(nav: dict, colour: str, link: Callable[[str], str | None]) -> str | None:
    """One corpus: its sections inside, their sub-sections outside. None when it has no sections."""
    tree = nav.get("tree") or {}
    title = nav.get("title") or nav.get("project") or ""
    items = tree_items(tree, link, title)
    if len(items) < 2:
        return None
    for n, item in enumerate(items):
        item["colour"] = colour if n % 2 == 0 else _mix(colour, "#ffffff", 0.22)
    pages = len(_pages_under(tree))
    return sunburst(items, title=f"{pages:,} pages", subtitle=f"{len(items)} sections",
                    size=360, rings=2, labels=False)
