"""
The check catalogue.

Each check answers one question about one repository and returns findings.
Checks read the gathered source (manifest fields plus file bodies from the
clone); none of them reason about intent, so two runs over the same head
produce the same findings.
"""

import posixpath
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Dict, List, Optional
from urllib.parse import unquote

from .finding import Finding

# --- policy ------------------------------------------------------------------
#
# What a repository of a given kind is expected to carry. `required` is an
# error when absent, `expected` a warning, `optional` an informational note.
# A kind the fleet registry does not name falls back to `default`.

PROFILES: Dict[str, Dict[str, tuple]] = {
    "default":  {"required": ("readme",), "expected": ("license",),
                 "optional": ("contributing", "changelog")},
    "app":      {"required": ("readme",), "expected": ("license", "contributing", "changelog"),
                 "optional": ("security", "code_of_conduct")},
    "site":     {"required": ("readme",), "expected": ("license",),
                 "optional": ("contributing", "changelog")},
    "theme":    {"required": ("readme",), "expected": ("license", "changelog"),
                 "optional": ("contributing", "security")},
    "tooling":  {"required": ("readme",), "expected": ("license",),
                 "optional": ("contributing", "changelog")},
    "library":  {"required": ("readme",), "expected": ("license", "changelog"),
                 "optional": ("contributing", "security")},
    "docs":     {"required": ("readme",), "expected": (), "optional": ("license",)},
    "game":     {"required": ("readme",), "expected": ("license",),
                 "optional": ("contributing", "changelog")},
    "hub":      {"required": ("readme",), "expected": ("license", "contributing"),
                 "optional": ("changelog", "security")},
    "demo":     {"required": ("readme",), "expected": (), "optional": ("license",)},
    "sandbox":  {"required": ("readme",), "expected": (), "optional": ()},
}

GOVERNANCE_PATTERNS = {
    "readme": (r"^readme(\.md|\.rst|\.txt)?$",),
    "license": (r"^licen[cs]e(\.md|\.txt)?$", r"^copying$"),
    "contributing": (r"^contributing(\.md)?$",),
    "changelog": (r"^changelog(\.md)?$", r"^changes(\.md)?$", r"^history(\.md)?$"),
    "security": (r"^security(\.md)?$",),
    "code_of_conduct": (r"^code[_-]of[_-]conduct(\.md)?$",),
}
GOVERNANCE_LABELS = {
    "readme": "README.md", "license": "LICENSE", "contributing": "CONTRIBUTING.md",
    "changelog": "CHANGELOG.md", "security": "SECURITY.md",
    "code_of_conduct": "CODE_OF_CONDUCT.md",
}
# Where a governance file is allowed to live (GitHub honours .github/ and docs/).
GOVERNANCE_DIRS = ("", ".github/", "docs/")

# README sections a reader looks for, and the words that signal each one.
README_SECTIONS = {
    "overview": ("overview", "about", "what is", "introduction", "intro",
                 "why", "summary", "description"),
    "install": ("install", "installation", "setup", "getting started",
                "get started", "quick start", "quickstart", "requirements",
                "prerequisites", "deploy"),
    "usage": ("usage", "use", "using", "how to", "example", "examples",
              "commands", "cli", "api", "quick reference", "run", "running",
              "features", "play"),
    "configuration": ("config", "configuration", "options", "settings",
                      "environment", "customize", "customization"),
    "development": ("develop", "development", "contributing", "build",
                    "test", "testing", "architecture", "design", "hacking",
                    "local"),
    "license": ("license", "licence", "copyright"),
}
CORE_SECTIONS = ("overview", "install", "usage")

# Directories that are not expected to explain themselves.
STRUCTURE_IGNORE = {
    ".git", ".github", ".vscode", ".idea", ".devcontainer", ".claude",
    ".cursor", ".obsidian", ".frontmatter", ".cms", ".crush", "node_modules",
    "vendor", "dist", "build", "out", "target", "coverage", "tmp", "temp",
    "logs", "log", "assets", "static", "public", "images", "img", "media",
    "fonts", "site", ".bundle", ".venv", "venv", "__pycache__", ".pytest_cache",
    ".archives", ".issues", ".quests", "_site",
}
# A directory is worth documenting when it holds this much source.
STRUCTURE_MIN_FILES = 4

STUB_WORDS = 60
ROOT_README_MIN_WORDS = 120

TODO_MARKER = re.compile(r"\b(TODO|TBD|FIXME|COMING SOON|WIP:|PLACEHOLDER)\b", re.I)
H1 = re.compile(r"^#\s+\S", re.M)
SETEXT_H1 = re.compile(r"^[^\n]+\n=+\s*$", re.M)
HEADING = re.compile(r"^(#{1,6})\s+(.+?)\s*#*$", re.M)
FENCE = re.compile(r"^\s{0,3}(`{3,}|~{3,})", re.M)
MD_LINK = re.compile(r"(?<!\!)\[[^\]]*\]\(\s*([^)\s]+)")
CODE_SUFFIXES = (".py", ".js", ".ts", ".tsx", ".jsx", ".rb", ".go", ".rs",
                 ".sh", ".bash", ".java", ".php", ".c", ".h", ".cpp", ".cs",
                 ".gd", ".lua", ".sql", ".yml", ".yaml", ".html", ".css", ".scss")

# Text in an aggregated corpus that is addressed to an agent rather than a
# reader. The corpus is served to AI clients, so this is a supply-chain
# screen, not a style rule.
INJECTION_PATTERNS = (
    (r"ignore\s+(all\s+)?(previous|prior|above)\s+instructions", "override attempt"),
    (r"disregard\s+(all\s+)?(previous|prior|the)\s+(instructions|rules)", "override attempt"),
    (r"you\s+are\s+now\s+(a|an)\s+\w+", "role reassignment"),
    (r"<\s*(system|assistant)\s*>", "role markup"),
    (r"\bBEGIN\s+SYSTEM\s+PROMPT\b", "prompt markup"),
    (r"(send|post|exfiltrate|upload)\s+(the\s+)?(api[_ ]?key|token|secret|credential)",
     "credential exfiltration"),
    (r"[‪-‮⁦-⁩]", "bidirectional control characters"),
)
INJECTION_RE = [(re.compile(p, re.I), label) for p, label in INJECTION_PATTERNS]


@dataclass
class CheckSpec:
    """Registration record for one check."""

    id: str
    title: str
    cls: str
    severity: str
    fn: Callable
    weight_component: str = ""


CHECKS: Dict[str, CheckSpec] = {}


def check(check_id: str, title: str, cls: str, severity: str,
          component: str = "") -> Callable:
    def register(fn: Callable) -> Callable:
        CHECKS[check_id] = CheckSpec(check_id, title, cls, severity, fn, component)
        return fn
    return register


# --- helpers -----------------------------------------------------------------

def _words(text: str) -> int:
    body = re.sub(r"```.*?```", " ", text or "", flags=re.S)
    body = re.sub(r"<!--.*?-->", " ", body, flags=re.S)
    return len(body.split())


def _find_governance(source, key: str) -> Optional[str]:
    patterns = [re.compile(p, re.I) for p in GOVERNANCE_PATTERNS[key]]
    for path in source.tree:
        directory, _, base = path.rpartition("/")
        prefix = f"{directory}/" if directory else ""
        if prefix not in GOVERNANCE_DIRS:
            continue
        if any(p.match(base) for p in patterns):
            return path
    return None


def _root_readme(source) -> Optional[str]:
    for path in source.tree:
        if "/" not in path and re.match(r"^readme(\.md|\.rst|\.txt)?$", path, re.I):
            return path
    return None


def _headings(text: str) -> List[str]:
    return [m.group(2).strip().lower() for m in HEADING.finditer(text or "")]


def _profile(kind: str) -> Dict[str, tuple]:
    return PROFILES.get(kind, PROFILES["default"])


# --- checks ------------------------------------------------------------------

@check("G1", "Governance files present for the repository's kind", "gap", "warn",
       component="governance")
def check_governance(source, ctx) -> List[Finding]:
    profile = _profile(ctx.get("kind", "default"))
    out: List[Finding] = []
    for tier, severity in (("required", "error"), ("expected", "warn"),
                           ("optional", "info")):
        for key in profile.get(tier, ()):
            if _find_governance(source, key):
                continue
            label = GOVERNANCE_LABELS[key]
            out.append(Finding(
                check="G1", cls="gap", severity=severity, repo=source.name,
                subject=label, message=f"No {label}",
                remedy=f"Add {label} at the repository root.",
                evidence={"kind": ctx.get("kind", "default"), "tier": tier},
            ))
    return out


@check("G2", "README covers the sections a reader looks for", "gap", "warn",
       component="readme")
def check_readme_sections(source, ctx) -> List[Finding]:
    path = _root_readme(source)
    if not path:
        return []
    text = source.read(path) or ""
    headings = _headings(text)
    haystack = " \n ".join(headings)
    lead = " ".join(text.split()[:120]).lower()
    out: List[Finding] = []
    for section, words in README_SECTIONS.items():
        hit = any(w in haystack for w in words)
        if section == "overview" and not hit:
            # An opening paragraph counts as an overview even with no heading.
            hit = _words(text) >= 40 and len(lead) > 80
        if hit:
            continue
        severity = "warn" if section in CORE_SECTIONS else "info"
        out.append(Finding(
            check="G2", cls="gap", severity=severity, repo=source.name,
            subject=section, path=path,
            message=f"README has no {section} section",
            remedy=f"Add a '{section.title()}' section to {path}.",
            evidence={"headings": headings[:12]},
        ))
    return out


# Documents that map a whole repository at once. A directory named in one of
# these is documented, even with no README of its own.
MAP_DOCS = ("docs/ARCHITECTURE.md", "ARCHITECTURE.md", "docs/architecture.md",
            "SCHEMA.md", "docs/README.md", "docs/index.md", "README.md",
            "CLAUDE.md", "AGENTS.md", "STRUCTURE.md", "docs/STRUCTURE.md")


def _mapped_dirs(source) -> set:
    """Directory names a central map document already explains."""
    mapped = set()
    for path in MAP_DOCS:
        text = source.read(path) if path in source.tree_set else None
        if not text:
            continue
        for match in re.finditer(r"[`\[/(]([A-Za-z0-9._-]{2,40})/", text):
            mapped.add(match.group(1))
        for match in re.finditer(r"^\s*\|\s*`?([A-Za-z0-9._-]{2,40})`?\s*\|", text, re.M):
            mapped.add(match.group(1))
    return mapped


@check("G3", "Substantial directories explain themselves", "gap", "info",
       component="structure")
def check_undocumented_dirs(source, ctx) -> List[Finding]:
    counts: Dict[str, int] = {}
    documented: Dict[str, bool] = {}
    for path in source.tree:
        if "/" not in path:
            continue
        top = path.split("/", 1)[0]
        if top in STRUCTURE_IGNORE or top.startswith("."):
            continue
        rest = path.split("/", 1)[1]
        if path.lower().endswith(CODE_SUFFIXES) or path.lower().endswith((".md", ".markdown")):
            counts[top] = counts.get(top, 0) + 1
        if "/" not in rest and re.match(r"^(readme|index)\.(md|markdown|rst)$", rest, re.I):
            documented[top] = True
    mapped = _mapped_dirs(source)
    out: List[Finding] = []
    for top, count in sorted(counts.items()):
        if count < STRUCTURE_MIN_FILES or documented.get(top) or top in mapped:
            continue
        out.append(Finding(
            check="G3", cls="gap", severity="info", repo=source.name,
            subject=top, path=f"{top}/",
            message=f"`{top}/` holds {count} files, has no README or index, "
                    f"and no central document maps it",
            remedy=f"Add {top}/README.md, or name it in the architecture map.",
            evidence={"files": count},
        ))
    return out


@check("G5", "Documents are more than a stub", "gap", "warn", component="readme")
def check_stubs(source, ctx) -> List[Finding]:
    out: List[Finding] = []
    root = _root_readme(source)
    if root:
        text = source.read(root) or ""
        count = _words(text)
        if count < ROOT_README_MIN_WORDS:
            out.append(Finding(
                check="G5", cls="gap", severity="warn", repo=source.name,
                subject=root, path=root,
                message=f"Root README is {count} words - too thin to orient a reader",
                remedy="Say what it is, who it is for, how to run it.",
                evidence={"words": count, "threshold": ROOT_README_MIN_WORDS},
            ))
        markers = TODO_MARKER.findall(text)
        if markers:
            out.append(Finding(
                check="G5", cls="gap", severity="info", repo=source.name,
                subject=f"{root}#markers", path=root,
                message=f"Root README carries unfinished markers ({len(markers)})",
                remedy="Resolve or remove the TODO/TBD markers.",
                evidence={"markers": sorted({m.upper() for m in markers})[:6]},
            ))
    for path, text in sorted(source.bodies.items()):
        if path == root or not path.lower().endswith((".md", ".markdown")):
            continue
        if _words(text) < STUB_WORDS:
            out.append(Finding(
                check="G5", cls="gap", severity="info", repo=source.name,
                subject=path, path=path, component="quality",
                message=f"`{path}` is {_words(text)} words",
                remedy="Expand it or fold it into a neighbouring page.",
                evidence={"words": _words(text)},
            ))
    return out


@check("G8", "Agent guidance is present and discoverable", "gap", "info",
       component="agent")
def check_agent_readiness(source, ctx) -> List[Finding]:
    names = {p.lower() for p in source.tree}
    has_guidance = any(n in names for n in (
        "claude.md", "agents.md", ".github/copilot-instructions.md"))
    out: List[Finding] = []
    if not has_guidance:
        out.append(Finding(
            check="G8", cls="gap", severity="info", repo=source.name,
            subject="guidance",
            message="No CLAUDE.md, AGENTS.md or copilot-instructions.md",
            remedy="Add CLAUDE.md: what the repo is, how to build and test it, "
                   "and the conventions an agent must respect.",
            evidence={},
        ))
    return out


@check("G10", "Repository metadata is filled in", "gap", "warn",
       component="metadata")
def check_repo_metadata(source, ctx) -> List[Finding]:
    meta = source.meta or {}
    out: List[Finding] = []
    if not (meta.get("description") or "").strip():
        out.append(Finding(
            check="G10", cls="gap", severity="warn", repo=source.name,
            subject="description",
            message="GitHub repository description is empty",
            remedy="Set the About description - it is the first and most "
                   "widely syndicated sentence about the project.",
            evidence={},
        ))
    if not meta.get("topics"):
        out.append(Finding(
            check="G10", cls="gap", severity="info", repo=source.name,
            subject="topics",
            message="No GitHub topics set",
            remedy="Add 3-6 topics so the repository is discoverable.",
            evidence={},
        ))
    if not (meta.get("license") or "").strip() or meta.get("license") == "NOASSERTION":
        out.append(Finding(
            check="G10", cls="gap", severity="info", repo=source.name,
            subject="license-metadata",
            message="GitHub reports no recognised license",
            remedy="Add a recognised LICENSE file so GitHub can detect it.",
            evidence={"reported": meta.get("license")},
        ))
    return out


@check("Q1", "Markdown is well formed", "quality", "warn", component="quality")
def check_markdown(source, ctx) -> List[Finding]:
    out: List[Finding] = []
    for path, text in sorted(source.bodies.items()):
        if not path.lower().endswith((".md", ".markdown")):
            continue
        body = re.sub(r"\A---\n.*?\n---\n", "", text or "", flags=re.S)
        if not H1.search(body) and not SETEXT_H1.search(body):
            out.append(Finding(
                check="Q1", cls="quality", severity="info", repo=source.name,
                subject=f"{path}#h1", path=path,
                message=f"`{path}` has no H1 heading",
                remedy="Give the page a single top-level heading.",
                evidence={},
            ))
        if len(FENCE.findall(body)) % 2 == 1:
            out.append(Finding(
                check="Q1", cls="quality", severity="warn", repo=source.name,
                subject=f"{path}#fence", path=path,
                message=f"`{path}` has an unbalanced code fence",
                remedy="Close the fence; everything after it renders as code.",
                evidence={},
            ))
    return out


@check("Q4", "No agent-directed instructions in documentation", "quality",
       "error", component="quality")
def check_injection(source, ctx) -> List[Finding]:
    out: List[Finding] = []
    for path, text in sorted(source.bodies.items()):
        for pattern, label in INJECTION_RE:
            match = pattern.search(text or "")
            if not match:
                continue
            excerpt = " ".join((text[max(0, match.start() - 40):match.end() + 40]).split())
            out.append(Finding(
                check="Q4", cls="quality", severity="error", repo=source.name,
                subject=f"{path}#{label.replace(' ', '-')}", path=path,
                message=f"`{path}` contains {label} text",
                remedy="Review by hand: this content is served to AI clients.",
                evidence={"excerpt": excerpt[:200]},
            ))
            break
    return out


@check("D8", "Relative links resolve", "drift", "warn", component="links")
def check_links(source, ctx) -> List[Finding]:
    tree = source.tree_set
    lowered = {p.lower(): p for p in tree}
    dirs = {p.rsplit("/", 1)[0] for p in tree if "/" in p}
    skip = tuple(ctx.get("link_exclude") or ())
    out: List[Finding] = []
    for path, text in sorted(source.bodies.items()):
        if not path.lower().endswith((".md", ".markdown")):
            continue
        if skip and path.startswith(skip):
            continue
        base = path.rsplit("/", 1)[0] if "/" in path else ""
        broken: List[str] = []
        for raw in MD_LINK.findall(text or ""):
            target = resolve_link(base, raw)
            if target is None or link_exists(target, tree, lowered, dirs):
                continue
            broken.append(raw.strip())
        for link in sorted(set(broken))[:12]:
            out.append(Finding(
                check="D8", cls="drift", severity="warn", repo=source.name,
                subject=f"{path}->{link}", path=path,
                message=f"`{path}` links to `{link}`, which is not in the repository",
                remedy="Fix the path or remove the link.",
                evidence={"target": link},
            ))
    return out


def resolve_link(base_dir: str, raw: str) -> Optional[str]:
    """
    Repository-relative target of one markdown link, or None when the link
    is not ours to resolve (external, site-absolute, an anchor, or escaping
    the repository root).
    """
    link = unquote(raw.strip().strip("<>")).split("#", 1)[0].split("?", 1)[0].strip()
    if not link or link.startswith("//"):
        return None
    if re.match(r"^[a-z][a-z0-9+.-]*:", link, re.I):      # http:, mailto:, data: ...
        return None
    if link.startswith("/"):                               # site-absolute: the renderer resolves it
        return None
    if link.startswith("{{") or link.startswith("{%"):     # a template expression, not a path
        return None
    if not re.fullmatch(r"[\w./~@+%-]+", link):
        return None                                        # not a path: prose, markup, a token
    joined = posixpath.join(base_dir, link) if base_dir else link
    target = posixpath.normpath(joined).lstrip("/")
    if target in (".", "") or target == ".." or target.startswith("../"):
        return None                                        # outside the repository
    return target


def link_exists(target: str, tree: set, lowered: Dict[str, str], dirs: set) -> bool:
    """
    True when a resolved target names something the repository actually has.

    A bare directory counts when it holds a landing page, and - because these
    are mostly Jekyll sites - a trailing-slash link also counts when a sibling
    page of that name exists, which is what the permalink resolves to.
    """
    if target in tree or target in dirs:
        return True
    if target.lower() in lowered:
        return True
    bare = target.rstrip("/")
    for landing in ("README.md", "readme.md", "index.md", "index.html", "index.rst"):
        if f"{bare}/{landing}" in tree:
            return True
    for suffix in (".md", ".markdown", ".html", ".rst"):
        if f"{bare}{suffix}" in tree or f"{bare}{suffix}".lower() in lowered:
            return True
    return False


def run_checks(source, ctx: Optional[Dict] = None,
               only: Optional[List[str]] = None) -> List[Finding]:
    """Run every registered check (or `only`) over one gathered source."""
    ctx = ctx or {}
    findings: List[Finding] = []
    for check_id, spec in CHECKS.items():
        if only and check_id not in only:
            continue
        findings.extend(spec.fn(source, ctx))
    return findings
