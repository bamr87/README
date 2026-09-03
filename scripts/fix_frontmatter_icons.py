#!/usr/bin/env python3
"""
Frontmatter icon normalizer (corpus quality gate).

Aggregated documents carry whatever icon vocabulary their upstream site used
- across this fleet that is Bootstrap Icons (``icon: bi-gear``). MkDocs
Material reads ``page.meta.icon`` for every *navigation entry* and resolves
it as a bundled SVG, so an unresolvable value is not a cosmetic problem: it
raises ``TemplateNotFound`` and fails the whole site build. That is what kept
the site's navigation hand-curated - only pages absent from the nav were
safe.

This normalizer makes every page navigable:

  - a value already addressing a bundled set (``material/…``, ``fontawesome/…``,
    ``octicons/…``, ``simple/…``) is left alone
  - a known Bootstrap name is translated to its Material equivalent
  - anything else is dropped from ``icon``

The upstream value is never lost: it is preserved as ``source_icon`` so the
originating site's intent survives the round trip (and the navigator can hand
it to other frontends).

Usage:
    python3 scripts/fix_frontmatter_icons.py            # report only
    python3 scripts/fix_frontmatter_icons.py --apply    # rewrite in place
    python3 scripts/fix_frontmatter_icons.py --root docs/it-journey --apply

Exit codes: 0 = clean or fixed, 1 = unresolvable icons remain (report mode).
"""

import argparse
import re
import sys
from pathlib import Path
from typing import Dict, Optional, Tuple

# Icon sets bundled with mkdocs-material; a value inside one of them resolves.
KNOWN_SETS = ("material/", "fontawesome/", "octicons/", "simple/")

# Bootstrap Icons -> Material Design Icons. Keys are matched with the `bi-`
# prefix stripped, so `bi-gear`, `bi bi-gear` and `gear` all land here.
BOOTSTRAP_TO_MATERIAL: Dict[str, str] = {
    "bar-chart-line": "material/chart-bar",
    "book": "material/book-open-variant",
    "book-half": "material/book-open-page-variant",
    "briefcase": "material/briefcase",
    "browser-chrome": "material/google-chrome",
    "bug": "material/bug",
    "cash": "material/cash",
    "code-slash": "material/code-tags",
    "collection": "material/folder-multiple",
    "cpu": "material/chip",
    "download": "material/download",
    "easel": "material/presentation",
    "egg-fried": "material/egg-fried",
    "flask": "material/flask",
    "folder": "material/folder",
    "gear": "material/cog",
    "gear-wide-connected": "material/cogs",
    "gem": "material/diamond-stone",
    "globe": "material/web",
    "graph-up": "material/chart-line",
    "graph-up-arrow": "material/trending-up",
    "grid-3x3-gap": "material/view-grid",
    "hdd-network": "material/server-network",
    "home": "material/home",
    "house": "material/home",
    "journal-bookmark": "material/notebook",
    "journal-code": "material/notebook",
    "journal-richtext": "material/notebook-edit",
    "joystick": "material/gamepad-variant",
    "lightning": "material/lightning-bolt",
    "map": "material/map",
    "mortarboard": "material/school",
    "palette": "material/palette",
    "palette2": "material/palette-outline",
    "robot": "material/robot",
    "rocket-takeoff": "material/rocket-launch",
    "server": "material/server",
    "shield-check": "material/shield-check",
    "shield-lock": "material/shield-lock",
    "signpost-2": "material/sign-direction",
    "speedometer2": "material/speedometer",
    "tech": "material/chip",
    "tools": "material/tools",
    "world": "material/earth",
}

FRONTMATTER = re.compile(r"\A---\r?\n(.*?)\r?\n---[ \t]*\r?\n", re.DOTALL)
ICON_LINE = re.compile(r"^icon:[ \t]*(.*?)[ \t]*(#.*)?$", re.MULTILINE)


def resolve_icon(raw: str) -> Optional[str]:
    """Map an upstream icon value onto a bundled Material icon, or None."""
    value = raw.strip().strip("\"'").strip()
    if not value:
        return None
    if value.startswith(KNOWN_SETS):
        return value
    # `bi bi-gear` -> `bi-gear`; then strip the `bi-` prefix.
    token = value.split()[-1]
    key = token[3:] if token.startswith("bi-") else token
    return BOOTSTRAP_TO_MATERIAL.get(key.casefold())


def normalize_frontmatter(frontmatter: Dict) -> Tuple[Dict, bool]:
    """Normalize a parsed frontmatter mapping in place-ish. Returns (fm, changed)."""
    raw = frontmatter.get("icon")
    if not isinstance(raw, str) or not raw.strip():
        return frontmatter, False
    resolved = resolve_icon(raw)
    if resolved == raw.strip():
        return frontmatter, False
    frontmatter.setdefault("source_icon", raw.strip())
    if resolved:
        frontmatter["icon"] = resolved
    else:
        frontmatter.pop("icon", None)
    return frontmatter, True


def _rewrite_text(text: str) -> Tuple[str, Optional[str], Optional[str]]:
    """Rewrite one document's icon line textually (frontmatter stays byte-stable)."""
    match = FRONTMATTER.match(text)
    if not match:
        return text, None, None
    block = match.group(1)
    icon = ICON_LINE.search(block)
    if not icon:
        return text, None, None
    raw = icon.group(1).strip()
    if not raw or raw.startswith(("{", "[", "|", ">")):
        return text, None, None
    resolved = resolve_icon(raw)
    if resolved == raw:
        return text, raw, resolved
    keep = f"source_icon: {raw}" if "source_icon:" not in block else None
    replacement = f"icon: {resolved}" if resolved else None
    parts = [p for p in (replacement, keep) if p]
    new_block = block[:icon.start()] + "\n".join(parts) + block[icon.end():]
    if not parts:                                   # dropped the only line
        new_block = re.sub(r"\n\n+", "\n", block[:icon.start()] + block[icon.end():])
    new_text = f"---\n{new_block.strip(chr(10))}\n---\n" + text[match.end():]
    return new_text, raw, resolved


def process_file(path: Path, apply: bool) -> Optional[Tuple[str, Optional[str]]]:
    """Returns (raw, resolved) when the file needed a change, else None."""
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return None
    new_text, raw, resolved = _rewrite_text(text)
    if raw is None or new_text == text:
        return None
    if apply:
        path.write_text(new_text, encoding="utf-8")
    return raw, resolved


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[1])
    parser.add_argument("--root", default="docs", help="corpus root (default: docs)")
    parser.add_argument("--apply", action="store_true",
                        help="rewrite files in place (default: report only)")
    parser.add_argument("--quiet", action="store_true")
    args = parser.parse_args(argv)

    root = Path(args.root)
    if not root.is_dir():
        print(f"error: {root} is not a directory", file=sys.stderr)
        return 2

    mapped, dropped = [], []
    for path in sorted(root.rglob("*.md")):
        outcome = process_file(path, args.apply)
        if outcome is None:
            continue
        raw, resolved = outcome
        (mapped if resolved else dropped).append((path, raw, resolved))

    if not args.quiet:
        for path, raw, resolved in mapped:
            print(f"{'mapped ' if args.apply else 'would map'} {path}: {raw} -> {resolved}")
        for path, raw, _ in dropped:
            print(f"{'dropped' if args.apply else 'would drop'} {path}: {raw} "
                  "(kept as source_icon)")
    total = len(mapped) + len(dropped)
    verb = "normalized" if args.apply else "need normalizing"
    print(f"{total} document(s) {verb} "
          f"({len(mapped)} mapped, {len(dropped)} dropped)")
    if total and not args.apply:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
