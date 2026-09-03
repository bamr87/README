"""
Fleet registry access.

_data/projects.yml is the source of truth for the set of projects the
engine describes. repos.txt (the aggregation input) is a generated surface
regenerated from the registry by `sync`.

The registry also owns the *navigation contract*: the `navigation:` block
carries fleet-wide defaults (depth cap, exclusions, section titles) and each
project may carry a `nav:` block overriding them. `navigator.py` is the only
consumer - it turns those rules plus the corpus folder hierarchy into the
published navigation tree.
"""

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional

import yaml

from .config import REGISTRY_PATH, REPOS_TXT_PATH


class RegistryError(ValueError):
    """Raised when the registry file is missing or malformed."""



# --- Navigation contract -----------------------------------------------------
#
# Fleet-wide fallbacks used when `navigation:` omits a key. They are declared
# here (not in the YAML) so a registry that predates the navigation contract
# still builds a sensible sidebar.

DEFAULT_INDEX_NAMES = ("index.md", "README.md", "readme.md", "home.md")
DEFAULT_MAX_DEPTH = 6
DEFAULT_SECTION_TITLES = {
    ".claude": "Claude",
    ".cms": "CMS",
    ".cursor": "Cursor",
    ".devcontainer": "Dev Container",
    ".github": "GitHub",
    ".issues": "Issues",
    ".quests": "Quests",
    "_data": "Data",
    "_includes": "Includes",
    "_layouts": "Layouts",
    "_posts": "Posts",
    "_quests": "Quests",
    "api": "API",
    "docs": "Documentation",
    "faq": "FAQ",
    "src": "Source",
    "ui": "UI",
}


@dataclass
class NavGroup:
    """A curated sidebar section gathering corpus paths that match `patterns`."""

    title: str
    patterns: List[str] = field(default_factory=list)


@dataclass
class NavSpec:
    """Per-project navigation overrides (`nav:` in a registry entry)."""

    title: Optional[str] = None
    order: Optional[int] = None
    max_depth: Optional[int] = None
    exclude: List[str] = field(default_factory=list)
    groups: List[NavGroup] = field(default_factory=list)


@dataclass
class NavDefaults:
    """Fleet-wide navigation rules (`navigation:` at the top of the registry)."""

    max_depth: int = DEFAULT_MAX_DEPTH
    index_names: List[str] = field(default_factory=lambda: list(DEFAULT_INDEX_NAMES))
    exclude: List[str] = field(default_factory=list)
    publish_hidden: bool = True
    section_titles: Dict[str, str] = field(
        default_factory=lambda: dict(DEFAULT_SECTION_TITLES))


def _parse_nav_groups(raw: Any, where: str) -> List[NavGroup]:
    if raw is None:
        return []
    if not isinstance(raw, list):
        raise RegistryError(f"{where}: `groups` must be a list")
    groups: List[NavGroup] = []
    for entry in raw:
        if not isinstance(entry, dict) or not entry.get("title"):
            raise RegistryError(f"{where}: each group needs a `title`")
        patterns = entry.get("match") or entry.get("patterns") or []
        if isinstance(patterns, str):
            patterns = [patterns]
        if not isinstance(patterns, list) or not patterns:
            raise RegistryError(
                f"{where}: group {entry['title']!r} needs a non-empty `match` list")
        groups.append(NavGroup(title=str(entry["title"]),
                               patterns=[str(p) for p in patterns]))
    return groups


def _parse_nav_spec(raw: Any, where: str) -> NavSpec:
    if raw is None:
        return NavSpec()
    if not isinstance(raw, dict):
        raise RegistryError(f"{where}: `nav` must be a mapping")
    exclude = raw.get("exclude") or []
    if isinstance(exclude, str):
        exclude = [exclude]
    if not isinstance(exclude, list):
        raise RegistryError(f"{where}: `nav.exclude` must be a list of globs")
    order = raw.get("order")
    max_depth = raw.get("max_depth")
    for key, value in (("order", order), ("max_depth", max_depth)):
        if value is not None and not isinstance(value, int):
            raise RegistryError(f"{where}: `nav.{key}` must be an integer")
    if max_depth is not None and max_depth < 1:
        raise RegistryError(f"{where}: `nav.max_depth` must be >= 1")
    return NavSpec(
        title=str(raw["title"]) if raw.get("title") else None,
        order=order,
        max_depth=max_depth,
        exclude=[str(p) for p in exclude],
        groups=_parse_nav_groups(raw.get("groups"), f"{where}.nav"),
    )


def _parse_nav_defaults(raw: Any) -> NavDefaults:
    defaults = NavDefaults()
    if raw is None:
        return defaults
    if not isinstance(raw, dict):
        raise RegistryError("`navigation` must be a mapping")
    if raw.get("max_depth") is not None:
        if not isinstance(raw["max_depth"], int) or raw["max_depth"] < 1:
            raise RegistryError("`navigation.max_depth` must be an integer >= 1")
        defaults.max_depth = raw["max_depth"]
    if raw.get("index_names") is not None:
        if not isinstance(raw["index_names"], list):
            raise RegistryError("`navigation.index_names` must be a list")
        defaults.index_names = [str(n) for n in raw["index_names"]]
    if raw.get("exclude") is not None:
        if not isinstance(raw["exclude"], list):
            raise RegistryError("`navigation.exclude` must be a list of globs")
        defaults.exclude = [str(p) for p in raw["exclude"]]
    if raw.get("publish_hidden") is not None:
        defaults.publish_hidden = bool(raw["publish_hidden"])
    if raw.get("section_titles") is not None:
        if not isinstance(raw["section_titles"], dict):
            raise RegistryError("`navigation.section_titles` must be a mapping")
        defaults.section_titles.update(
            {str(k): str(v) for k, v in raw["section_titles"].items()})
    return defaults


@dataclass
class Project:
    name: str
    repo: str
    url: str
    branch: Optional[str] = None
    status: str = "active"
    kind: str = "project"
    description: str = ""
    topics: List[str] = field(default_factory=list)
    aggregate: bool = True
    external: bool = False
    nav: NavSpec = field(default_factory=NavSpec)

    @property
    def nav_title(self) -> str:
        """Sidebar label for this project (registry override wins)."""
        return self.nav.title or self.name

    @property
    def is_active(self) -> bool:
        return self.status != "archived"

    @property
    def clone_spec(self) -> str:
        """URL line for repos.txt (url#branch when a branch is pinned)."""
        return f"{self.url}#{self.branch}" if self.branch else self.url


@dataclass
class Registry:
    hub: Dict
    projects: List[Project]
    version: int = 1
    navigation: NavDefaults = field(default_factory=NavDefaults)

    def nav_ordered(self) -> List[Project]:
        """Active projects in sidebar order (`nav.order`, then registry order)."""
        return [
            project for _, project in sorted(
                ((p.nav.order if p.nav.order is not None else 1000 + i, p)
                 for i, p in enumerate(self.active())),
                key=lambda pair: (pair[0], pair[1].name),
            )
        ]

    def active(self) -> List[Project]:
        return [p for p in self.projects if p.is_active]

    def get(self, name: str) -> Optional[Project]:
        for project in self.projects:
            if project.name == name:
                return project
        return None


def load_registry(path: Path = REGISTRY_PATH) -> Registry:
    if not path.is_file():
        raise RegistryError(f"registry not found: {path}")
    try:
        data = yaml.safe_load(path.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        raise RegistryError(f"registry is not valid YAML: {exc}") from exc
    if not isinstance(data, dict) or not isinstance(data.get("projects"), list):
        raise RegistryError("registry must be a mapping with a `projects` list")

    defaults = data.get("defaults") or {}
    projects: List[Project] = []
    seen = set()
    for raw in data["projects"]:
        if not isinstance(raw, dict):
            raise RegistryError(f"project entry must be a mapping: {raw!r}")
        merged = {**defaults, **raw}
        missing = [key for key in ("name", "repo", "url") if not merged.get(key)]
        if missing:
            raise RegistryError(f"project {raw.get('name', raw)!r} missing fields: {missing}")
        if merged["name"] in seen:
            raise RegistryError(f"duplicate project name: {merged['name']}")
        seen.add(merged["name"])
        projects.append(Project(
            name=str(merged["name"]),
            repo=str(merged["repo"]),
            url=str(merged["url"]).rstrip("/"),
            branch=merged.get("branch"),
            status=str(merged.get("status", "active")),
            kind=str(merged.get("kind", "project")),
            description=" ".join(str(merged.get("description", "")).split()),
            topics=[str(t) for t in (merged.get("topics") or [])],
            aggregate=bool(merged.get("aggregate", True)),
            external=bool(merged.get("external", False)),
            nav=_parse_nav_spec(merged.get("nav"), f"project {merged['name']!r}"),
        ))

    return Registry(hub=data.get("hub") or {}, projects=projects,
                    version=int(data.get("version", 1)),
                    navigation=_parse_nav_defaults(data.get("navigation")))


def render_repos_txt(registry: Registry) -> str:
    """Render the generated repos.txt content from the registry."""
    lines = [
        "# repos.txt - GENERATED from _data/projects.yml.",
        "# Do not hand-edit: update the registry, then run",
        "#   python3 -m scripts.context_engine sync",
        "# Format: one clone URL per line, optional #branch suffix.",
        "",
    ]
    for project in registry.active():
        if not project.aggregate:
            lines.append(f"# skipped (aggregate: false): {project.clone_spec}")
            continue
        lines.append(project.clone_spec)
    return "\n".join(lines) + "\n"


def sync_repos_txt(registry: Registry, path: Path = REPOS_TXT_PATH) -> bool:
    """Regenerate repos.txt; returns True when the file changed."""
    content = render_repos_txt(registry)
    old = path.read_text(encoding="utf-8") if path.is_file() else None
    if old == content:
        return False
    path.write_text(content, encoding="utf-8")
    return True
