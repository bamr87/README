"""
The documentation framework checks (bamr87/bamr87 specs/DOCS.md, area DOC).

Each check here is one UPS-DOC row read the same way the hub's conformance
checker reads it, so the fleet review and a repository's own CI agree. The
index and summary rows go further and reuse the generator itself: this repo
vendors the hub's `tools/docs_index.py`, and a fresh index is whatever that
file would write - there is no second definition to drift from.

Rows a repository names under `## Standard deviations` in its AGENTS.md are
reported as waived (info) rather than as findings - the framework's SHOULD
rows are allowed to be deviated from, out loud.
"""

import hashlib
import importlib.util
import re
from typing import Dict, List, Optional

from ..config import ROOT
from .checks import check
from .finding import Finding

DOCS_INDEX_PATH = ROOT / "tools" / "docs_index.py"
INDEX = "docs/README.md"
WORD_BUDGET = 2000
CLAUDE_MAX_LINES = 20
AGENTS_HEADINGS = ("What this repo is", "Stack & commands", "Layout", "Conventions",
                   "Fleet context", "Standard deviations")
README_SECTIONS = (
    ("Overview", r"overview|what it is|about"),
    ("Quick start", r"quick ?start|getting started|usage|install|working with this repo"),
    ("Project structure", r"project structure|structure|layout|what'?s in"),
    ("Development", r"develop|working with this repo"),
    ("Contributing", r"contribut"),
    ("License", r"licen[cs]e"),
)
ROOT_RECORDS = {
    "README.md", "AGENTS.md", "CLAUDE.md", "CHANGELOG.md", "CONTRIBUTING.md", "SECURITY.md",
    "CODE_OF_CONDUCT.md", "SCHEMA.md", "PRD.md", "BACKLOG.md", "ATTRIBUTION.md",
}
DUPLICATE_MIN_WORDS = 25
DUPLICATE_LIMIT = 8

_MODULE: Dict[str, object] = {}


def docs_index():
    """The vendored tools/docs_index.py as a module, or None when absent."""
    if "mod" not in _MODULE:
        mod = None
        if DOCS_INDEX_PATH.is_file():
            spec = importlib.util.spec_from_file_location("docs_index", DOCS_INDEX_PATH)
            mod = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(mod)
        _MODULE["mod"] = mod
    return _MODULE["mod"]


# --- helpers -----------------------------------------------------------------

def words(text: str) -> int:
    """Prose words: generated spans, code fences and comments do not count."""
    text = re.sub(r"<!-- AUTO:([\w-]+):start.*?<!-- AUTO:\1:end -->", " ", text or "", flags=re.S)
    text = re.sub(r"^\s*(`{3,}|~{3,}).*?^\s*\1", " ", text, flags=re.S | re.M)
    text = re.sub(r"<!--.*?-->", " ", text, flags=re.S)
    return len(text.split())


def h2s(text: str) -> List[str]:
    body = re.sub(r"^\s*(`{3,}|~{3,}).*?^\s*\1", "", text or "", flags=re.S | re.M)
    return [m.group(1).strip() for m in re.finditer(r"^##[ \t]+(.+?)[ \t]*#*[ \t]*$", body, re.M)]


def waived(source, row: str) -> bool:
    """`row` (e.g. UPS-DOC-08) is named under AGENTS.md's Standard deviations."""
    text = source.read("AGENTS.md") or ""
    m = re.search(r"^##[ \t]+Standard deviations[ \t]*$(.*?)(?=^##[ \t]|\Z)", text, re.M | re.S | re.I)
    return bool(m and re.search(re.escape(row) + r"\b", m.group(1)))


def _finding(check_id: str, source, subject: str, message: str, remedy: str,
             severity: str = "warn", path: Optional[str] = None, evidence: Optional[Dict] = None,
             row: str = "") -> Finding:
    if row and severity != "info" and waived(source, row):
        severity, message = "info", f"{message} (waived under Standard deviations)"
    return Finding(check=check_id, cls="alignment", severity=severity, repo=source.name,
                   subject=subject, path=path, message=message, remedy=remedy,
                   evidence=evidence or {})


def index_options(source) -> Dict:
    di = docs_index()
    text = source.read(INDEX) if INDEX in source.tree_set else None
    where = di.locate(text) if (di and text) else None
    return di.parse_options(where[2] if where else "") if di else {}


def inventory(source) -> List[Dict]:
    """Every document the repository's index lists, with its size and summary."""
    di = docs_index()
    if di is None:
        return []
    docs = di.collect(str(source.clone_dir), index_options(source),
                      files=source.tree, reader=source.read)
    for doc in docs:
        doc["words"] = words(source.read(doc["path"]) or "")
    return docs


# --- checks ------------------------------------------------------------------

@check("DOC-09", "AGENTS.md is canonical, CLAUDE.md a pointer (UPS-DOC-09, UPS-AGENT-07/08)",
       "alignment", "warn", component="agent")
def check_agent_files(source, ctx) -> List[Finding]:
    out: List[Finding] = []
    tree = source.tree_set
    agents = source.read("AGENTS.md") if "AGENTS.md" in tree else None
    if agents is None:
        out.append(_finding("DOC-09", source, "agents", "No AGENTS.md (the canonical agent file)",
                            "Add AGENTS.md from the sdlc kit template; make CLAUDE.md import it."))
    else:
        m = re.search(r"^#[ \t]+(.+?)[ \t]*$", agents, re.M)
        title = m.group(1) if m else ""
        if not title or re.search(r"(?i)^agents\.md\b|claude\.md", title):
            out.append(_finding("DOC-09", source, "agents-title", f"AGENTS.md is titled `# {title or '—'}`",
                                "Title it with the repository's name.", path="AGENTS.md"))
        if re.search(r"(?i)moved verbatim from the former CLAUDE\.md", agents):
            out.append(_finding("DOC-09", source, "agents-moved-verbatim",
                                "AGENTS.md still carries an unfolded \"moved verbatim\" block",
                                "Fold it into the six headings and drop the duplicates.", path="AGENTS.md"))
        have = {h.lower() for h in h2s(agents)}
        missing = [h for h in AGENTS_HEADINGS if h.lower() not in have]
        if missing:
            out.append(_finding("DOC-09", source, "agents-headings",
                                "AGENTS.md lacks " + ", ".join(f"`## {h}`" for h in missing),
                                "Use the six UPS-AGENT-07 headings.", path="AGENTS.md",
                                evidence={"missing": missing}))
    claude = source.read("CLAUDE.md") if "CLAUDE.md" in tree else None
    if claude is not None:
        lines = sum(1 for line in claude.splitlines() if line.strip())
        if not re.search(r"^@AGENTS\.md[ \t]*$", claude, re.M) or lines > CLAUDE_MAX_LINES:
            out.append(_finding("DOC-09", source, "claude-pointer",
                                f"CLAUDE.md is not the pointer ({lines} non-blank lines"
                                + ("" if "@AGENTS.md" in claude else ", no `@AGENTS.md` import") + ")",
                                "Move its rules into AGENTS.md and replace it with the kit pointer.",
                                path="CLAUDE.md", evidence={"lines": lines}))
    return out


@check("DOC-10", "README follows the portfolio skeleton (UPS-DOC-10)", "alignment", "warn",
       component="readme")
def check_readme_skeleton(source, ctx) -> List[Finding]:
    if "README.md" not in source.tree_set:
        return []
    text = source.read("README.md") or ""
    out: List[Finding] = []
    joined = " | ".join(h2s(text)).lower()
    missing = [name for name, rx in README_SECTIONS if not re.search(rx, joined)]
    if missing:
        out.append(_finding("DOC-10", source, "readme-sections",
                            "README lacks " + ", ".join(missing),
                            "Follow the portfolio skeleton (bamr87/bamr87 docs/PORTFOLIO.md §4).",
                            path="README.md", evidence={"missing": missing}, row="UPS-DOC-10"))
    has_docs = any(p.startswith("docs/") for p in source.tree)
    if has_docs and not re.search(r"\]\((\./)?docs/(README\.md)?(#[^)]*)?\)", text):
        out.append(_finding("DOC-10", source, "readme-docs-link", "README does not link docs/README.md",
                            "Link the docs index from a `## Documentation` section.", path="README.md",
                            row="UPS-DOC-10"))
    return out


@check("DOC-02", "Every document has one H1 and a summary line (UPS-DOC-02)", "alignment", "warn",
       component="quality")
def check_summaries(source, ctx) -> List[Finding]:
    docs = inventory(source)
    out: List[Finding] = []
    bare = [d["path"] for d in docs if d["source"] in ("fallback", "none")]
    if bare:
        out.append(_finding("DOC-02", source, "summaries",
                            f"{len(bare)} of {len(docs)} documents have no summary line",
                            "Add `> one sentence` under each H1 (or `description:` in front matter); "
                            "`python3 tools/docs_index.py --lint` lists them.",
                            evidence={"paths": bare[:25]}))
    multi = [d["path"] for d in docs if d["h1"] > 1]
    if multi:
        out.append(_finding("DOC-02", source, "h1", f"{len(multi)} documents have several H1 headings",
                            "One H1 per document.", evidence={"paths": multi[:25]}))
    return out


@check("DOC-03", "docs/README.md is the generated index (UPS-DOC-03)", "alignment", "warn",
       component="quality")
def check_index(source, ctx) -> List[Finding]:
    if not any(p.startswith("docs/") for p in source.tree):
        return []
    di = docs_index()
    if di is None:
        return []
    current, fresh = di.build(str(source.clone_dir), files=source.tree, reader=source.read)
    if current is None:
        message = "No docs/README.md index"
    elif fresh is None:
        message = "docs/README.md has no `AUTO:docs-index` span"
    elif current != fresh:
        message = "docs/README.md index is stale"
    else:
        return []
    return [_finding("DOC-03", source, "index", message,
                     "Vendor tools/docs_index.py and run `python3 tools/docs_index.py --write`.",
                     path=INDEX)]


@check("DOC-04", "The root holds docs of record only (UPS-DOC-04)", "alignment", "info",
       component="structure")
def check_root_docs(source, ctx) -> List[Finding]:
    stray = []
    for path in source.tree:
        if "/" in path or not path.lower().endswith(".md") or path in ROOT_RECORDS:
            continue
        head = (source.read(path) or "")[:4000]
        front = head.split("---", 2)[1] if head.startswith("---") and head.count("---") >= 2 else ""
        if re.search(r"^(layout|permalink):", front, re.M) or re.match(r"\s*<!--\s*generated\b", head, re.I):
            continue
        stray.append(path)
    if not stray:
        return []
    return [_finding("DOC-04", source, "root", "Root documents that are not docs of record: "
                     + ", ".join(sorted(stray)[:8]), "Move them into docs/ and fix the links.",
                     severity="warn", evidence={"paths": sorted(stray)}, row="UPS-DOC-04")]


@check("DOC-08", "Always-loaded files stay within budget (UPS-DOC-08)", "alignment", "info",
       component="agent")
def check_budgets(source, ctx) -> List[Finding]:
    out: List[Finding] = []
    for path in ("AGENTS.md", "README.md"):
        if path not in source.tree_set:
            continue
        count = words(source.read(path) or "")
        if count > WORD_BUDGET:
            out.append(_finding("DOC-08", source, f"budget-{path}", f"{path} is {count} words "
                                f"(budget {WORD_BUDGET})", "Move deep dives into docs/ and link them.",
                                severity="warn", path=path, evidence={"words": count}, row="UPS-DOC-08"))
    return out


def _paragraphs(text: str) -> List[str]:
    body = re.sub(r"^\s*(`{3,}|~{3,}).*?^\s*\1", "", text or "", flags=re.S | re.M)
    body = re.sub(r"<!--.*?-->", "", body, flags=re.S)
    out = []
    for line in body.splitlines():
        s = line.strip()
        if not s or s.startswith(("#", "|", "<", ">", "!")):
            continue
        s = re.sub(r"^([-*+]|\d+[.)])\s+", "", s)
        if len(s.split()) >= DUPLICATE_MIN_WORDS:
            out.append(s)
    return out


def _normal(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


@check("DOC-01", "No paragraph is said twice (UPS-DOC-01)", "alignment", "info", component="quality")
def check_repeats(source, ctx) -> List[Finding]:
    candidates = [p for p in ("README.md", "AGENTS.md", "CLAUDE.md", "CONTRIBUTING.md")
                  if p in source.tree_set]
    candidates += [p for p in source.tree if p.startswith("docs/") and p.endswith(".md")][:200]
    seen: Dict[str, List[str]] = {}
    sample: Dict[str, str] = {}
    for path in candidates:
        for para in _paragraphs(source.read(path) or ""):
            key = hashlib.sha1(_normal(para).encode("utf-8")).hexdigest()[:12]
            if path not in seen.setdefault(key, []):
                seen[key].append(path)
            sample.setdefault(key, para)
    repeated = sorted(((k, v) for k, v in seen.items() if len(v) > 1), key=lambda kv: (-len(kv[1]), kv[0]))
    out: List[Finding] = []
    for key, paths in repeated[:DUPLICATE_LIMIT]:
        out.append(_finding("DOC-01", source, f"repeat-{key}",
                            f"The same paragraph appears in {', '.join(paths)}",
                            "Keep it in its one home and link to it from the others.",
                            severity="info", evidence={"paths": paths, "excerpt": sample[key][:160]}))
    return out
