"""
Build orchestration: registry -> extract -> navigate -> synthesize -> assemble
-> index, with lifecycle hooks between stages.

`navigate` sits between extraction and synthesis because the navigation tree
is both an output (nav.yml, context/nav/, docs/browse/) and an input: cards
and facts describe a project's structure using the same sections the sidebar
shows, so the two can never drift.
"""

from typing import Dict, Optional

from .ai import BaseProvider, get_provider
from .assembler import (
    build_apex, fleet_table, inject_auto_span, write_context_tree,
    write_site_index,
)
from .extractor import attach_nav_facts, extract_facts, load_docs_index
from .hooks import run_hooks
from .indexer import build_index, write_index
from .navigator import navigate
from .registry import Registry, load_registry, sync_repos_txt
from .synthesizer import build_card


def build_all(ai_spec: str = "auto", registry: Optional[Registry] = None,
              run_stage_hooks: bool = True, sync: bool = True,
              update_readme: bool = True, update_site_index: bool = True,
              update_nav: bool = True) -> Dict:
    """Run the full pipeline; returns a summary dict."""
    registry = registry or load_registry()
    provider: Optional[BaseProvider] = get_provider(ai_spec)
    enrichment = f"ai:{provider.name}" if provider else "heuristic"

    def hooks(stage: str) -> None:
        if run_stage_hooks:
            run_hooks(stage, {"CONTEXT_ENRICHMENT": enrichment})

    hooks("pre_build")

    if sync:
        changed = sync_repos_txt(registry)
        print(f"[sync] repos.txt {'regenerated' if changed else 'up to date'}")

    docs_index = load_docs_index()
    facts_by_name = {
        project.name: extract_facts(project, docs_index=docs_index)
        for project in registry.active()
    }
    print(f"[extract] {len(facts_by_name)} projects "
          f"(corpus index: {'present' if docs_index else 'absent'})")
    hooks("post_extract")

    fleet_nav = navigate(registry, write_mkdocs=update_nav, write_browse=update_nav)
    for name, facts in facts_by_name.items():
        attach_nav_facts(facts, fleet_nav["projects"].get(name))
    print(f"[navigate] {fleet_nav['counts']['pages']} pages across "
          f"{fleet_nav['counts']['projects']} corpora"
          + (f" (+{len(fleet_nav['extras'])} unregistered)" if fleet_nav["extras"] else "")
          + ("" if update_nav else "; nav.yml/browse skipped"))
    hooks("post_navigate")

    cards = {name: build_card(facts, ai=provider)
             for name, facts in facts_by_name.items()}
    print(f"[synthesize] {len(cards)} cards ({enrichment})")
    hooks("post_synthesize")

    apex_md = build_apex(registry, facts_by_name, ai=provider)
    write_context_tree(apex_md, cards, facts_by_name)
    if update_readme:
        span_changed = inject_auto_span(fleet_table(registry, facts_by_name))
        print(f"[assemble] README AUTO span {'updated' if span_changed else 'unchanged'}")
    if update_site_index:
        write_site_index(registry, facts_by_name)
    print("[assemble] context/ tree written")
    hooks("post_assemble")

    index = build_index(registry, facts_by_name, cards, apex_md, enrichment,
                        fleet_nav=fleet_nav)
    write_index(index, docs_index, fleet_nav=fleet_nav)
    print(f"[index] {len(index['terms'])} terms across {len(index['documents'])} documents")
    hooks("post_index")

    hooks("post_build")
    return {
        "projects": len(facts_by_name),
        "enrichment": enrichment,
        "terms": len(index["terms"]),
        "nav_pages": fleet_nav["counts"]["pages"],
    }
