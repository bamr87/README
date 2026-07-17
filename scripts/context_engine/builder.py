"""
Build orchestration: registry -> extract -> synthesize -> assemble -> index,
with lifecycle hooks between stages.
"""

from typing import Dict, Optional

from .ai import BaseProvider, get_provider
from .assembler import (
    build_apex, fleet_table, inject_auto_span, write_context_tree,
    write_site_index,
)
from .extractor import extract_facts, load_docs_index
from .hooks import run_hooks
from .indexer import build_index, write_index
from .registry import Registry, load_registry, sync_repos_txt
from .synthesizer import build_card


def build_all(ai_spec: str = "auto", registry: Optional[Registry] = None,
              run_stage_hooks: bool = True, sync: bool = True,
              update_readme: bool = True, update_site_index: bool = True) -> Dict:
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

    index = build_index(registry, facts_by_name, cards, apex_md, enrichment)
    write_index(index, docs_index)
    print(f"[index] {len(index['terms'])} terms across {len(index['documents'])} documents")
    hooks("post_index")

    hooks("post_build")
    return {
        "projects": len(facts_by_name),
        "enrichment": enrichment,
        "terms": len(index["terms"]),
    }
