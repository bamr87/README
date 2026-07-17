"""
Fleet registry access.

_data/projects.yml is the source of truth for the set of projects the
engine describes. repos.txt (the aggregation input) is a generated surface
regenerated from the registry by `sync`.
"""

from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional

import yaml

from .config import REGISTRY_PATH, REPOS_TXT_PATH


class RegistryError(ValueError):
    """Raised when the registry file is missing or malformed."""


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
        ))

    return Registry(hub=data.get("hub") or {}, projects=projects,
                    version=int(data.get("version", 1)))


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
