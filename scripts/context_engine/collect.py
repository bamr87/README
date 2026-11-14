"""
Collect: the whole extract-transform-load path of the corpus, in one stage.

For each registry project it clones (or reads a local checkout), selects the
official documentation with the registry's `collect:` rules, normalizes each
page in memory, and writes docs/<name>/. Pages the source no longer offers are
removed, so the corpus cannot keep a stale page. A page is rewritten only when
its content changed.

The folder structure is the navigation contract and stays as upstream has it.
The one exception is a dot-prefixed segment, which is renamed with
`collect.hidden_prefix`: neither GitHub Pages nor Obsidian shows dot-paths.

Provenance sits in front matter as a repo, a path and a branch-based URL, never
a commit: a commit there would rewrite every page on every upstream change.
The commit a crawl read is recorded once per project in context/vault/collect.json.
"""

import json
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import yaml

from .config import (
    CACHE_DIR, CHANGE_LOG_PATH, COLLECT_MANIFEST_PATH, DOCS_DIR, ROOT,
)
from .navigator import GlobSet
from .registry import CollectRules, Project, Registry
from .vault import weave_pages

sys.path.insert(0, str(ROOT / "scripts"))
from fix_frontmatter_icons import normalize_frontmatter  # noqa: E402

CLONE_TIMEOUT = 600
_FRONT_MATTER = re.compile(r"\A---\s*\n(.*?)\n---[ \t]*(?:\n|\Z)", re.S)
_H1 = re.compile(r"^#\s+(.+)$", re.M)
# A relative Markdown link target, so renamed dot-segments can follow the page.
_LINK_TARGET = re.compile(r"(\]\()(?![a-z][a-z0-9+.-]*:|#|/)([^)\s]+)", re.I)


@dataclass
class Source:
    """A checked-out project ready to read."""

    root: Path
    commit: str
    commit_date: str
    branch: str


def _git(cwd: Path, *args: str) -> str:
    done = subprocess.run(["git", "-C", str(cwd), *args], capture_output=True,
                          text=True, timeout=CLONE_TIMEOUT)
    if done.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)}: {done.stderr.strip()[:300]}")
    return done.stdout.strip()


def _default_branch(root: Path) -> str:
    try:
        return _git(root, "symbolic-ref", "--short",
                    "refs/remotes/origin/HEAD").split("/", 1)[1]
    except (RuntimeError, IndexError):
        return _git(root, "rev-parse", "--abbrev-ref", "HEAD")


def _describe(root: Path, project: Project) -> Source:
    return Source(root=root, commit=_git(root, "rev-parse", "HEAD"),
                  commit_date=_git(root, "log", "-1", "--format=%cs"),
                  branch=project.branch or _default_branch(root))


def fetch(project: Project, cache_dir: Path = CACHE_DIR,
          workspace: Optional[Path] = None) -> Source:
    """Extract: a local checkout when a workspace has one, else a shallow clone."""
    if workspace is not None:
        local = workspace / project.name
        if (local / ".git").exists():
            return _describe(local, project)
    target = cache_dir / project.name
    if (target / ".git").exists():
        branch = project.branch or _default_branch(target)
        _git(target, "fetch", "--depth", "1", "origin", branch)
        _git(target, "reset", "--hard", "FETCH_HEAD")
    else:
        shutil.rmtree(target, ignore_errors=True)
        target.parent.mkdir(parents=True, exist_ok=True)
        command = ["git", "clone", "--depth", "1"]
        if project.branch:
            command += ["--branch", project.branch]
        done = subprocess.run(command + [project.url, str(target)], text=True,
                              capture_output=True, timeout=CLONE_TIMEOUT)
        if done.returncode != 0:
            raise RuntimeError(f"clone {project.url}: {done.stderr.strip()[:300]}")
    return _describe(target, project)


def select(paths: List[str], fleet: CollectRules,
           project: CollectRules) -> List[str]:
    """The paths that count as official documentation."""
    exclude = GlobSet(fleet.exclude + project.exclude)
    include = GlobSet(fleet.include + project.include)
    return sorted(path for path in paths
                  if include.matches_any_parent(path)
                  or not exclude.matches_any_parent(path))


def corpus_path(rel: str, hidden_prefix: str) -> str:
    """Upstream path -> corpus path; only dot-prefixed segments change."""
    return "/".join(hidden_prefix + part[1:] if part.startswith(".") else part
                    for part in rel.split("/"))


def _rename_link_targets(body: str, hidden_prefix: str) -> str:
    def repl(match: "re.Match[str]") -> str:
        parts = match.group(2).split("/")
        renamed = [hidden_prefix + p[1:]
                   if p.startswith(".") and p not in (".", "..") else p
                   for p in parts]
        return match.group(1) + "/".join(renamed)
    return _LINK_TARGET.sub(repl, body)


def split_front_matter(text: str) -> Tuple[Dict, str]:
    """Front matter and body; unparseable front matter is left in the body."""
    match = _FRONT_MATTER.match(text)
    if match:
        try:
            data = yaml.safe_load(match.group(1))
        except yaml.YAMLError:
            return {}, text
        if isinstance(data, dict):
            return data, text[match.end():]
        if data is None:
            return {}, text[match.end():]
    return {}, text


def _title(meta: Dict, body: str, rel: str) -> str:
    title = meta.get("title")
    if title not in (None, ""):
        return str(title)
    heading = _H1.search(body)
    if heading:
        return heading.group(1).strip()
    return Path(rel).stem.replace("_", " ").replace("-", " ").title()


def _flat_tags(tags) -> List[str]:
    if isinstance(tags, str):
        return [tags]
    flat: List[str] = []
    for item in tags or []:
        if isinstance(item, list):
            flat.extend(str(sub) for sub in item)
        else:
            flat.append(str(item))
    return flat


def transform(text: str, rel: str, project: Project, source: Source,
              hidden_prefix: str = "dot-") -> str:
    """Transform: one upstream page -> one corpus page. Pure and idempotent."""
    meta, body = split_front_matter(text)
    meta["title"] = _title(meta, body, rel)
    meta["source_file"] = rel
    meta["source_repo"] = project.repo
    meta["source_url"] = (f"https://github.com/{project.repo}/blob/"
                          f"{source.branch}/{rel}")
    meta, _ = normalize_frontmatter(meta)
    if "tags" in meta:
        meta["tags"] = _flat_tags(meta["tags"])
    head = yaml.dump(meta, default_flow_style=False, allow_unicode=True)
    return f"---\n{head}---\n{_rename_link_targets(body, hidden_prefix)}"


def _load(project: Project, pages: Dict[str, str], docs_dir: Path) -> Dict[str, List[str]]:
    """Load: write what changed, delete what upstream no longer offers."""
    corpus = docs_dir / project.name
    existing = ({p.relative_to(corpus).as_posix() for p in corpus.rglob("*.md")}
                if corpus.is_dir() else set())
    changes: Dict[str, List[str]] = {"added": [], "changed": [], "removed": []}
    for rel, content in sorted(pages.items()):
        target = corpus / rel
        if rel not in existing:
            changes["added"].append(rel)
        elif target.read_text(encoding="utf-8", errors="replace") == content:
            continue
        else:
            changes["changed"].append(rel)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")
    for rel in sorted(existing - set(pages)):
        (corpus / rel).unlink()
        changes["removed"].append(rel)
    if corpus.is_dir():
        for directory in sorted((p for p in corpus.rglob("*") if p.is_dir()),
                                key=lambda p: len(p.parts), reverse=True):
            if not any(directory.iterdir()):
                directory.rmdir()
    return changes


def _unwrap(paths: List[Path]) -> None:
    """One paragraph per line, with the exclusions the prose gate uses."""
    if not paths:
        return
    subprocess.run(
        [sys.executable, str(ROOT / "tools" / "unwrap-prose.py"), "--write",
         *[str(p) for p in paths],
         "--exclude", r"(^|/)SCHEMA\.md$", "--exclude", r"(^|/)CHANGELOG\.md$"],
        check=True, capture_output=True, text=True, cwd=ROOT)


def _stage(pages: Dict[str, str], scratch: Path) -> Dict[str, str]:
    """Run the prose unwrapper over transformed pages, without touching docs/."""
    shutil.rmtree(scratch, ignore_errors=True)
    for rel, content in pages.items():
        target = scratch / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")
    if pages:
        _unwrap([scratch])
    staged = {rel: (scratch / rel).read_text(encoding="utf-8") for rel in pages}
    shutil.rmtree(scratch, ignore_errors=True)
    return staged


def upstream_path(rel: str, hidden_prefix: str) -> str:
    """Corpus path -> upstream path, the inverse of `corpus_path`."""
    return "/".join("." + part[len(hidden_prefix):] if part.startswith(hidden_prefix)
                    else part for part in rel.split("/"))


def collect_frozen(project: Project, registry: Registry, docs_dir: Path,
                   cache_dir: Path) -> Dict:
    """Re-normalize a project whose repository is gone, from its last crawl.

    Its pages are the only copy left, so they stay; they still have to obey
    the current selection and path rules like every other corpus.
    """
    prefix = registry.collect.hidden_prefix
    corpus = docs_dir / project.name
    found = {upstream_path(p.relative_to(corpus).as_posix(), prefix): p
             for p in corpus.rglob("*.md")}
    source = Source(root=corpus, commit="", commit_date="", branch=project.branch or "main")
    pages = {corpus_path(rel, prefix): transform(
                 found[rel].read_text(encoding="utf-8", errors="replace"),
                 rel, project, source, prefix)
             for rel in select(list(found), registry.collect, project.collect)}
    staged = _stage(pages, cache_dir.parent / "collect-stage" / project.name)
    return {"source": source, "pages": staged, "tracked": len(found), "frozen": True}


def collect_project(project: Project, registry: Registry,
                    cache_dir: Path = CACHE_DIR,
                    workspace: Optional[Path] = None) -> Dict:
    """Extract and transform one project; nothing is written to the corpus."""
    source = fetch(project, cache_dir=cache_dir, workspace=workspace)
    prefix = registry.collect.hidden_prefix
    tracked = [line for line in _git(source.root, "ls-files", "-z").split("\0")
               if line.lower().endswith(".md")]
    pages: Dict[str, str] = {}
    for rel in select(tracked, registry.collect, project.collect):
        path = source.root / rel
        if path.is_symlink() or not path.is_file():
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        pages[corpus_path(rel, prefix)] = transform(text, rel, project, source, prefix)
    staged = _stage(pages, cache_dir.parent / "collect-stage" / project.name)
    return {"source": source, "pages": staged, "tracked": len(tracked)}


def _record(entries: Dict[str, Dict], log_lines: List[Dict],
            manifest_path: Path, log_path: Path) -> None:
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    merged: Dict[str, Dict] = {}
    if manifest_path.is_file():
        merged = json.loads(manifest_path.read_text(encoding="utf-8"))
    merged.update(entries)
    manifest_path.write_text(json.dumps(merged, indent=2, sort_keys=True) + "\n",
                             encoding="utf-8")
    if log_lines:
        with log_path.open("a", encoding="utf-8") as handle:
            for line in log_lines:
                handle.write(json.dumps(line, sort_keys=True, ensure_ascii=False) + "\n")


def _on_disk(docs_dir: Path, skip: List[str]) -> Dict[str, str]:
    """Corpus pages this run did not stage, so links into them still resolve."""
    pages: Dict[str, str] = {}
    for path in docs_dir.rglob("*.md"):
        rel = path.relative_to(docs_dir).as_posix()
        if rel.split("/")[0] not in skip:
            pages[rel] = path.read_text(encoding="utf-8", errors="replace")
    return pages


def collect(registry: Registry, names: Optional[List[str]] = None,
            docs_dir: Path = DOCS_DIR, cache_dir: Path = CACHE_DIR,
            workspace: Optional[Path] = None,
            manifest_path: Path = COLLECT_MANIFEST_PATH,
            log_path: Path = CHANGE_LOG_PATH) -> Dict[str, Dict]:
    """Collect every aggregated project (or `names`).

    Every project is staged before any is written, because weaving a link
    needs the whole corpus: a page may point into another repository.
    """
    projects = [p for p in registry.active() if p.aggregate
                and (not names or p.name in names)]
    if not names:
        for project in registry.projects:
            if not project.is_active:
                shutil.rmtree(docs_dir / project.name, ignore_errors=True)
    results: Dict[str, Dict] = {}
    failures: List[str] = []
    for project in projects:
        try:
            results[project.name] = collect_project(
                project, registry, cache_dir=cache_dir, workspace=workspace)
        except (RuntimeError, OSError, subprocess.TimeoutExpired) as exc:
            # One unreachable repository must not empty the corpus or stop the
            # refresh of the others. The manifest marks its pages as frozen,
            # and the hot note shows that to whoever reads the brain next.
            reason = str(exc).strip().splitlines()[-1][:160]
            failures.append(f"{project.name}: {reason}")
            print(f"[collect] {project.name}: unreachable, freezing its pages ({reason})")
            if (docs_dir / project.name).is_dir():
                results[project.name] = collect_frozen(project, registry, docs_dir,
                                                        cache_dir)

    staged = {f"{name}/{rel}": text for name, result in results.items()
              for rel, text in result["pages"].items()}
    # Never the brain: a corpus page must not depend on a generated note, or a
    # stub concept would rewrite the very link it was created from.
    context = _on_disk(docs_dir, skip=[*results, "brain"])
    woven, stats = weave_pages(staged, context)
    print(f"[collect] weave rewrote {stats['links']} links in {stats['pages']} pages")

    entries: Dict[str, Dict] = {}
    log_lines: List[Dict] = []
    for project in projects:
        if project.name not in results:
            continue
        result = results[project.name]
        source: Source = result["source"]
        prefix = f"{project.name}/"
        pages = {rel[len(prefix):]: text for rel, text in woven.items()
                 if rel.startswith(prefix)}
        changes = _load(project, pages, docs_dir)
        entries[project.name] = {
            "repo": project.repo, "branch": source.branch, "commit": source.commit,
            "commit_date": source.commit_date, "pages": len(pages),
            "tracked_markdown": result["tracked"],
            "status": "frozen" if result.get("frozen") else "live",
        }
        if any(changes.values()) and not result.get("frozen"):
            log_lines.append({
                "project": project.name, "commit": source.commit[:12],
                "date": source.commit_date, "pages": len(pages),
                **{key: len(paths) for key, paths in changes.items()},
                "sample": (changes["added"] + changes["changed"])[:8],
            })
        print(f"[collect] {project.name}: {len(pages)} of {result['tracked']} "
              f"Markdown files (+{len(changes['added'])} "
              f"~{len(changes['changed'])} -{len(changes['removed'])})")
    _record(entries, log_lines, manifest_path, log_path)
    live = sum(1 for entry in entries.values() if entry["status"] == "live")
    if projects and not live:
        raise RuntimeError("collect reached no repository: " + "; ".join(failures))
    return entries
