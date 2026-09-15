"""Source adapters. Today: git over HTTPS, shallow and blobless."""

import hashlib
import json
import re
import subprocess
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Sequence

from .. import ENGINE_VERSION
from ..config import ROOT

CACHE_DIR = ROOT / ".cache" / "fleet"
CLONE_TIMEOUT = 180
GIT_TIMEOUT = 60

# Files whose content a check may need. Everything else is known by path only.
GOVERNANCE_FILES = (
    "README.md", "README.rst", "README.txt", "README",
    "LICENSE", "LICENSE.md", "LICENSE.txt", "COPYING",
    "CONTRIBUTING.md", "CHANGELOG.md", "SECURITY.md", "CODE_OF_CONDUCT.md",
    "CLAUDE.md", "AGENTS.md", "SCHEMA.md", "PRD.md", "CITATION.cff",
)
# Project manifests that say what the thing is built from.
STACK_MANIFESTS = {
    "package.json": "node", "pyproject.toml": "python", "setup.py": "python",
    "requirements.txt": "python", "Gemfile": "ruby", "go.mod": "go",
    "Cargo.toml": "rust", "composer.json": "php", "pom.xml": "java",
    "Dockerfile": "docker", "docker-compose.yml": "docker",
    "_config.yml": "jekyll", "mkdocs.yml": "mkdocs", "project.godot": "godot",
    "Makefile": "make", ".mcp.json": "mcp",
}
DOC_SUFFIXES = (".md", ".markdown", ".rst", ".adoc", ".txt")
MAX_DOC_BODIES = 240          # blobs fetched per repo; the rest stay path-only
MAX_TREE_FILES = 40000


class GatherError(RuntimeError):
    """The repository could not be cloned or read."""


@dataclass
class RepoSource:
    """One repository's gathered state: the manifest plus its live clone."""

    name: str
    repo: str
    url: str
    clone_dir: Path
    head_sha: str = ""
    head_date: str = ""
    default_branch: str = ""
    tree: List[str] = field(default_factory=list)
    bodies: Dict[str, str] = field(default_factory=dict)
    meta: Dict = field(default_factory=dict)
    error: str = ""
    # A working tree reads uncommitted content from disk; a clone reads HEAD.
    working_tree: bool = False

    @property
    def ok(self) -> bool:
        return not self.error

    @property
    def tree_set(self) -> set:
        return set(self.tree)

    def read(self, path: str) -> Optional[str]:
        """Content of one tracked file, fetching the blob if needed."""
        if path in self.bodies:
            return self.bodies[path]
        if path not in self.tree_set:
            return None
        if self.working_tree:
            try:
                text = (self.clone_dir / path).read_text(encoding="utf-8", errors="replace")
            except OSError:
                text = None
        else:
            text = _git_show(self.clone_dir, path)
        if text is not None:
            self.bodies[path] = text
        return text

    def docs(self) -> List[str]:
        return [p for p in self.tree if p.lower().endswith(DOC_SUFFIXES)
                or Path(p).name in GOVERNANCE_FILES]

    def top_dirs(self) -> List[str]:
        seen = []
        for path in self.tree:
            if "/" in path:
                head = path.split("/", 1)[0]
                if head not in seen:
                    seen.append(head)
        return seen

    def stack(self) -> List[str]:
        found = []
        names = {Path(p).name for p in self.tree if "/" not in p}
        for manifest, label in STACK_MANIFESTS.items():
            if manifest in names and label not in found:
                found.append(label)
        return found

    def fingerprint(self) -> str:
        payload = "\n".join(sorted(self.tree))
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]

    def manifest(self) -> Dict:
        """The committed summary (the full tree stays in the clone)."""
        docs = self.docs()
        return {
            "schema_version": "1.0",
            "engine_version": ENGINE_VERSION,
            "name": self.name,
            "repo": self.repo,
            "url": self.url,
            "default_branch": self.default_branch,
            "head": {"sha": self.head_sha, "date": self.head_date},
            "fingerprint": self.fingerprint(),
            "counts": {
                "files": len(self.tree),
                "docs": len(docs),
                "top_dirs": len(self.top_dirs()),
            },
            "stack": self.stack(),
            "top_dirs": self.top_dirs()[:40],
            "docs": docs[:400],
            "github": self.meta,
            "error": self.error,
        }


def _run(args: Sequence[str], cwd: Optional[Path] = None,
         timeout: int = GIT_TIMEOUT) -> subprocess.CompletedProcess:
    return subprocess.run(list(args), cwd=str(cwd) if cwd else None,
                          capture_output=True, text=True, timeout=timeout)


def _git_show(clone_dir: Path, path: str) -> Optional[str]:
    try:
        done = _run(["git", "show", f"HEAD:{path}"], cwd=clone_dir)
    except (subprocess.TimeoutExpired, OSError):
        return None
    return done.stdout if done.returncode == 0 else None


def _clone(url: str, dest: Path, branch: Optional[str] = None) -> None:
    """Shallow, blobless, no-checkout clone; refreshes an existing cache."""
    if (dest / "HEAD").is_file() or (dest / ".git").exists():
        fetched = _run(["git", "fetch", "--depth=1", "--quiet", "origin"],
                       cwd=dest, timeout=CLONE_TIMEOUT)
        if fetched.returncode == 0:
            _run(["git", "reset", "--soft", "FETCH_HEAD"], cwd=dest)
            return
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists():
        _run(["rm", "-rf", str(dest)])
    args = ["git", "clone", "--depth=1", "--filter=blob:none", "--no-checkout",
            "--quiet"]
    if branch:
        args += ["--branch", branch]
    args += [url, str(dest)]
    done = _run(args, timeout=CLONE_TIMEOUT)
    if done.returncode != 0:
        raise GatherError((done.stderr or done.stdout or "clone failed").strip()[:300])


def gather_repo(name: str, repo: str, url: str, branch: Optional[str] = None,
                meta: Optional[Dict] = None,
                cache_dir: Path = CACHE_DIR) -> RepoSource:
    """Clone (or refresh) one repository and read its tree."""
    clone_dir = cache_dir / name
    source = RepoSource(name=name, repo=repo, url=url, clone_dir=clone_dir,
                        meta=dict(meta or {}))
    try:
        _clone(url, clone_dir, branch)
    except (GatherError, subprocess.TimeoutExpired, OSError) as exc:
        source.error = str(exc)[:300]
        return source

    head = _run(["git", "log", "-1", "--format=%H%x09%cI"], cwd=clone_dir)
    if head.returncode == 0 and "\t" in head.stdout:
        source.head_sha, _, source.head_date = head.stdout.strip().partition("\t")
    ref = _run(["git", "symbolic-ref", "--short", "HEAD"], cwd=clone_dir)
    source.default_branch = ref.stdout.strip() if ref.returncode == 0 else (branch or "")

    listing = _run(["git", "ls-tree", "-r", "--name-only", "HEAD"], cwd=clone_dir)
    if listing.returncode != 0:
        source.error = (listing.stderr or "could not read tree").strip()[:300]
        return source
    source.tree = [p for p in listing.stdout.splitlines() if p][:MAX_TREE_FILES]

    _prefetch(source)
    return source


def _prefetch(source: RepoSource) -> None:
    """Read the bodies the checks will want, newest-shallowest first."""
    names = set(GOVERNANCE_FILES)
    wanted: List[str] = []
    for path in source.tree:
        base = Path(path).name
        depth = path.count("/")
        if base in names and depth <= 2:
            wanted.append(path)
        elif depth == 0 and path.lower().endswith(DOC_SUFFIXES):
            wanted.append(path)
        elif base.lower() in ("index.md", "readme.md") and depth <= 3:
            wanted.append(path)
    for path in wanted[:MAX_DOC_BODIES]:
        source.read(path)


def gather_local(path: Path, name: Optional[str] = None,
                 repo: str = "", url: str = "",
                 meta: Optional[Dict] = None) -> RepoSource:
    """
    Gather a working tree instead of a remote.

    Same checks, uncommitted content: this is how you see what a change does
    to a repository's findings before pushing it.
    """
    path = Path(path).resolve()
    source = RepoSource(name=name or path.name, repo=repo or path.name,
                        url=url or str(path), clone_dir=path,
                        meta=dict(meta or {}), working_tree=True)
    if not (path / ".git").exists():
        source.error = f"not a git working tree: {path}"
        return source

    head = _run(["git", "log", "-1", "--format=%H%x09%cI"], cwd=path)
    if head.returncode == 0 and "\t" in head.stdout:
        source.head_sha, _, source.head_date = head.stdout.strip().partition("\t")
    ref = _run(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=path)
    source.default_branch = ref.stdout.strip() if ref.returncode == 0 else ""

    listing = _run(["git", "ls-files"], cwd=path)
    if listing.returncode != 0:
        source.error = (listing.stderr or "could not list files").strip()[:300]
        return source
    source.tree = [p for p in listing.stdout.splitlines() if p][:MAX_TREE_FILES]
    _prefetch(source)
    return source


def gather_fleet(entries: Sequence[Dict], cache_dir: Path = CACHE_DIR,
                 progress: bool = True) -> List[RepoSource]:
    """Gather every entry; failures are recorded, never raised."""
    sources: List[RepoSource] = []
    for i, entry in enumerate(entries, 1):
        source = gather_repo(
            name=entry["name"], repo=entry["repo"], url=entry["url"],
            branch=entry.get("branch"), meta=entry.get("github") or {},
            cache_dir=cache_dir,
        )
        sources.append(source)
        if progress:
            status = f"{len(source.tree):>6} files" if source.ok else f"FAILED: {source.error[:60]}"
            print(f"[gather {i:>2}/{len(entries)}] {source.name:<24} {status}")
    return sources
