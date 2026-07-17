#!/usr/bin/env python3
"""
SCHEMA.md pyramid linter for the README context engine.

Every governed directory carries a SCHEMA.md describing its entries in a
Structure table (entry | kind | purpose | rules). This linter walks the
pyramid from a root SCHEMA.md, validating that:

  - frontmatter declares a `schema` version (and optional `coverage` mode)
  - the Structure table parses and uses the known vocabulary
  - entries marked `required` exist on disk with the declared kind
  - under `coverage: full`, nothing exists on disk that is not listed
  - child directories that carry their own SCHEMA.md are recursed into,
    stopping at `generated` and `terminal` boundaries

Compatible with the parent monorepo protocol (`schema_lint.py check .`).

Usage:
    python3 scripts/schema_lint.py check [path]   # lint pyramid, exit 1 on errors
    python3 scripts/schema_lint.py tree  [path]   # print the pyramid that was visited

Exit codes: 0 = clean (warnings allowed), 1 = errors found, 2 = usage error.
"""

import re
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple

KINDS = {"dir", "file"}
RULES = {"required", "generated", "terminal", "optional"}
COVERAGE_MODES = {"listed", "full"}

# Never reported as unlisted, never descended into.
IGNORED_NAMES = {
    ".git", "__pycache__", ".venv", "venv", "node_modules", ".pytest_cache",
    "temp", "raw_docs", "site", ".DS_Store", ".harmonize", ".idea", ".vscode",
}


class SchemaEntry:
    def __init__(self, name: str, kind: str, purpose: str, rules: List[str]):
        self.name = name
        self.kind = kind
        self.purpose = purpose
        self.rules = rules

    def has(self, rule: str) -> bool:
        return rule in self.rules


class SchemaDoc:
    def __init__(self, path: Path):
        self.path = path
        self.schema_version: Optional[str] = None
        self.coverage: str = "listed"
        self.entries: List[SchemaEntry] = []
        self.errors: List[str] = []
        self.warnings: List[str] = []


def _parse_frontmatter(text: str, doc: SchemaDoc) -> str:
    """Extract minimal frontmatter; return the body after it."""
    if not text.startswith("---"):
        doc.errors.append("missing frontmatter block")
        return text
    match = re.search(r"\n---\s*\n", text[3:])
    if not match:
        doc.errors.append("unterminated frontmatter block")
        return text
    fm_text = text[3 : match.start() + 3]
    body = text[3 + match.end() :]
    for line in fm_text.splitlines():
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        key, value = key.strip(), value.strip().strip("\"'")
        if key == "schema":
            doc.schema_version = value
        elif key == "coverage":
            doc.coverage = value
    if not doc.schema_version:
        doc.errors.append("frontmatter missing `schema` version")
    if doc.coverage not in COVERAGE_MODES:
        doc.errors.append(
            f"unknown coverage mode `{doc.coverage}` (expected one of {sorted(COVERAGE_MODES)})"
        )
        doc.coverage = "listed"
    return body


def _parse_structure_table(body: str, doc: SchemaDoc) -> None:
    """Parse the `## Structure` table into entries."""
    section = re.split(r"^##\s+Structure\s*$", body, maxsplit=1, flags=re.MULTILINE)
    if len(section) < 2:
        doc.errors.append("missing `## Structure` section")
        return
    rows = []
    for line in section[1].splitlines():
        stripped = line.strip()
        if stripped.startswith("##"):
            break
        if stripped.startswith("|"):
            rows.append(stripped)
    if len(rows) < 3:
        doc.errors.append("Structure table needs a header, separator, and at least one row")
        return
    for row in rows[2:]:  # skip header + separator
        cells = [c.strip() for c in row.strip("|").split("|")]
        if len(cells) != 4:
            doc.errors.append(f"malformed table row (expected 4 cells): {row}")
            continue
        raw_name, kind, purpose, raw_rules = cells
        name = raw_name.strip("`").rstrip("/")
        if not name:
            doc.errors.append(f"empty entry name in row: {row}")
            continue
        if kind not in KINDS:
            doc.errors.append(f"`{name}`: unknown kind `{kind}` (expected dir|file)")
            continue
        rules = [t for t in re.split(r"[,\s]+", raw_rules) if t]
        unknown = [t for t in rules if t not in RULES]
        if unknown:
            doc.errors.append(f"`{name}`: unknown rule token(s) {unknown} (expected {sorted(RULES)})")
            rules = [t for t in rules if t in RULES]
        doc.entries.append(SchemaEntry(name, kind, purpose, rules))


def parse_schema(path: Path) -> SchemaDoc:
    doc = SchemaDoc(path)
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as exc:
        doc.errors.append(f"unreadable: {exc}")
        return doc
    body = _parse_frontmatter(text, doc)
    _parse_structure_table(body, doc)
    return doc


def lint_directory(directory: Path, visited: List[Path]) -> Tuple[List[str], List[str]]:
    """Lint the SCHEMA.md governing `directory`, recursing into sub-pyramids."""
    errors: List[str] = []
    warnings: List[str] = []
    schema_path = directory / "SCHEMA.md"
    doc = parse_schema(schema_path)
    visited.append(schema_path)
    rel = schema_path

    errors.extend(f"{rel}: {msg}" for msg in doc.errors)
    warnings.extend(f"{rel}: {msg}" for msg in doc.warnings)

    listed_names = set()
    for entry in doc.entries:
        listed_names.add(entry.name)
        target = directory / entry.name
        exists = target.exists()
        kind_ok = target.is_dir() if entry.kind == "dir" else target.is_file()
        if entry.has("required") and (not exists or not kind_ok):
            errors.append(f"{rel}: required {entry.kind} `{entry.name}` is missing")
            continue
        if exists and not kind_ok:
            errors.append(f"{rel}: `{entry.name}` exists but is not a {entry.kind}")
            continue
        if not exists:
            if not entry.has("generated") and not entry.has("optional"):
                warnings.append(f"{rel}: listed {entry.kind} `{entry.name}` not present")
            continue
        # Recurse into governed sub-pyramids.
        if (
            entry.kind == "dir"
            and not entry.has("generated")
            and not entry.has("terminal")
            and (target / "SCHEMA.md").is_file()
        ):
            sub_errors, sub_warnings = lint_directory(target, visited)
            errors.extend(sub_errors)
            warnings.extend(sub_warnings)

    if doc.coverage == "full" and not doc.errors:
        for child in sorted(directory.iterdir()):
            if child.name in IGNORED_NAMES:
                continue
            if child.name not in listed_names:
                errors.append(f"{rel}: `{child.name}` exists on disk but is not listed (coverage: full)")

    return errors, warnings


def cmd_check(root: Path) -> int:
    if not (root / "SCHEMA.md").is_file():
        print(f"error: no SCHEMA.md at {root}", file=sys.stderr)
        return 1
    visited: List[Path] = []
    errors, warnings = lint_directory(root, visited)
    for warning in warnings:
        print(f"warning: {warning}")
    for error in errors:
        print(f"error: {error}")
    print(f"schema_lint: {len(visited)} SCHEMA.md node(s), "
          f"{len(errors)} error(s), {len(warnings)} warning(s)")
    return 1 if errors else 0


def cmd_tree(root: Path) -> int:
    if not (root / "SCHEMA.md").is_file():
        print(f"error: no SCHEMA.md at {root}", file=sys.stderr)
        return 1
    visited: List[Path] = []
    lint_directory(root, visited)
    for node in visited:
        try:
            shown = node.relative_to(root)
        except ValueError:
            shown = node
        print(shown)
    return 0


def main(argv: List[str]) -> int:
    if len(argv) < 2 or argv[1] not in {"check", "tree"}:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    root = Path(argv[2]) if len(argv) > 2 else Path(".")
    if argv[1] == "check":
        return cmd_check(root)
    return cmd_tree(root)


if __name__ == "__main__":
    sys.exit(main(sys.argv))
