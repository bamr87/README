"""
Card synthesis (L1 of the pyramid).

Turns a project's fact sheet into a human-readable card. The baseline is
fully heuristic; when an AI provider is supplied, a single enrichment call
distills the facts into an "essence" paragraph (failures fall back to the
heuristic text so builds never depend on an API).
"""

import json
from typing import Dict, List, Optional

from . import ENGINE_VERSION
from .ai import AIError, BaseProvider


def _heuristic_essence(facts: Dict) -> str:
    project = facts["project"]
    identity = facts.get("identity") or {}
    parts: List[str] = []
    if project.get("registry_description"):
        parts.append(project["registry_description"].rstrip("."))
    summary = identity.get("summary", "")
    if summary and summary[:60].lower() not in (parts[0][:60].lower() if parts else ""):
        parts.append(summary.rstrip("."))
    return (". ".join(parts) + ".") if parts else f"{project['name']} - no summary available yet."


def _ai_essence(facts: Dict, ai: BaseProvider) -> str:
    prompt = (
        "Write a 2-3 sentence essence paragraph for this project's card in the "
        "fleet's consolidated README. State what the project is, what it "
        "contains, and why someone would open it.\n\nFACTS:\n"
        + json.dumps(facts, indent=2, sort_keys=True)[:6000]
    )
    return ai.complete(prompt, max_tokens=400).strip()


def build_card(facts: Dict, ai: Optional[BaseProvider] = None) -> str:
    """Render one project card as markdown with a frontmatter contract."""
    project = facts["project"]
    identity = facts.get("identity") or {}
    corpus = facts.get("corpus") or {}
    signals = facts.get("signals") or {}
    rollups = facts.get("rollups") or {}
    name = project["name"]

    enrichment = "heuristic"
    essence = _heuristic_essence(facts)
    if ai is not None:
        try:
            essence = _ai_essence(facts, ai)
            enrichment = f"ai:{ai.name}"
        except AIError as exc:
            print(f"[synthesizer] AI enrichment failed for {name}, "
                  f"using heuristic essence: {exc}")

    tags = sorted(set(project.get("topics") or []) | set(rollups.get("top_tags") or []))[:12]
    title = identity.get("title") or name

    lines: List[str] = [
        "---",
        f"title: {json.dumps(title)}",
        f"repo: {project['repo']}",
        "category: project-card",
        f"kind: {project.get('kind', 'project')}",
        f"status: {project.get('status', 'active')}",
        "generated: true",
        f"generated_by: context_engine {ENGINE_VERSION}",
        f"enrichment: {enrichment}",
        f"source_fingerprint: {corpus.get('fingerprint', 'n/a')}",
        "tags:",
        *[f"  - {tag}" for tag in tags],
        "---",
        "",
        f"# {title}",
        "",
        f"> {essence}",
        "",
        "| | |",
        "|---|---|",
        f"| Repository | [{project['repo']}]({project['url']}) |",
        f"| Kind | {project.get('kind', 'project')} |",
        f"| Status | {project.get('status', 'active')} |",
        f"| Branch | {project.get('branch') or 'default'} |",
        f"| Corpus | `{corpus.get('path', '')}` - {corpus.get('file_count', 0)} docs |",
        f"| External | {'yes' if project.get('external') else 'no'} |",
        "",
    ]

    signal_labels = {
        "has_schema_md": "carries its own SCHEMA.md pyramid",
        "has_claude_md": "has CLAUDE.md agent guidance",
        "has_agents_md": "has AGENTS.md operating manual",
        "has_contributing": "has a contribution guide",
        "has_changelog": "keeps a changelog",
        "has_security_policy": "has a security policy",
    }
    active_signals = [label for key, label in signal_labels.items() if signals.get(key)]
    lines += ["## Signals", ""]
    if active_signals:
        lines += [f"- {label}" for label in active_signals]
    else:
        lines.append("- no governance signal files detected in the corpus")
    if rollups:
        words = rollups.get("total_words")
        if words:
            lines.append(f"- ~{words:,} words across {rollups.get('indexed_documents', 0)} indexed documents")
        languages = rollups.get("code_languages") or []
        if languages:
            lines.append(f"- code samples in: {', '.join(languages)}")
    lines.append("")

    top_dirs = (facts.get("structure") or {}).get("top_dirs") or []
    if top_dirs:
        lines += ["## Structure", ""]
        lines += [f"- `{d['name']}/` ({d['doc_count']} docs)" for d in top_dirs[:8]]
        lines.append("")

    key_docs = facts.get("key_docs") or []
    if key_docs:
        lines += ["## Key documents", ""]
        lines += [f"- [`{doc}`](../../docs/{name}/{doc})" for doc in key_docs]
        lines.append("")

    lines += [
        "## Query this context",
        "",
        "```bash",
        f"python3 -m scripts.context_engine query {name}",
        f"python3 -m scripts.context_engine facts {name}",
        "```",
        "",
        f"MCP: `get_project` with `{{\"name\": \"{name}\"}}` "
        "(server: `mcp/server.py`, registered in `.mcp.json`).",
        "",
    ]
    return "\n".join(lines)
