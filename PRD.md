# PRD — README context engine (v2)

> v2 repurposes this repository from a generic documentation aggregator
> (the v1 MVP, preserved in git history) into the **consolidated README of
> the bamr87/bamr87 monorepo**: a dedicated, continuously evolving context
> engine — MCP- and AI-augmented — that describes every submodule in the
> fleet and can be queried by humans, CI, and AI agents.

## 1. Problem

The bamr87 monorepo manages a fleet of independent project repos. Knowledge about the fleet is scattered across dozens of READMEs and doc trees that drift, duplicate, and go stale. Humans can't hold the whole picture; AI agents working on any one repo lack cheap, current context about the others. Hand-maintaining a master README does not scale past a handful of projects.

## 2. Vision

A README that is **built, not written**. This repo crawls the fleet, distills what it finds into a pyramid of context, publishes the apex as the consolidated README, and serves the whole pyramid through query interfaces. Because the pipeline reruns on a schedule, the context grows and corrects itself as the fleet evolves.

## 3. Architecture — the pyramid (per the monorepo SCHEMA protocol)

| Layer | Artifact | Audience | Producer |
|---|---|---|---|
| L0 apex | `context/README.md` + root README `AUTO:projects` span + `docs/index.md` | humans skimming the fleet | assembler |
| L1 cards | `context/cards/<project>.md` | humans + agents needing one project's essence | synthesizer |
| L2 facts | `context/facts/<project>.json` | machines, diffing, enrichment prompts | extractor |
| L3 corpus | `docs/<project>/**` + `docs/docs_index.json` | deep dives, full-text search | aggregation stages 1–4 |
| Query | `context/index/` + CLI + MCP server | everyone | indexer + `mcp/server.py` |

Supporting contracts:

- **Registry as source of truth** — `_data/projects.yml`; `repos.txt` and
  every generated surface are regenerated from it, never hand-edited.
- **SCHEMA.md pyramid** — every governed directory carries a SCHEMA.md
(structure table, placement, forbidden); `scripts/schema_lint.py check .` is the drift gate, wired into CI, matching the parent monorepo protocol.
- **Hooks** — `hooks.d/<stage>/` executables run at each engine stage, the
  extension point for AI orchestration around the pipeline.

## 4. Functional requirements

1. **Crawl**: aggregate markdown from every active registry project
   (clone/pull, branch pins, external repos) — stages 1–3 (existing).
2. **Extract**: derive per-project facts offline from the corpus: identity
(title/summary/headings), governance signals (SCHEMA.md, CLAUDE.md, AGENTS.md, …), structure, rollups (tags/categories/languages/words), key documents, and a corpus fingerprint for change detection.
3. **Synthesize**: render facts into per-project cards with a frontmatter
   contract; optionally AI-enrich the essence paragraph.
4. **Assemble**: build the consolidated apex README; inject the fleet table
into the root README `AUTO:projects` span; mirror the fleet overview to the published site home (`docs/index.md`).
5. **Index**: build a term index + manifest so queries need no rescan.
6. **Serve**: answer queries via CLI (`query/card/facts/apex/status/
projects`) and via MCP (`list_projects`, `get_project`, `search_context`, `get_readme`, `get_schema`, `context_status` + `context://` resources).
7. **Evolve**: scheduled CI re-crawls, rebuilds, schema-lints, and commits;
   hooks allow agents to extend every build.

## 5. Non-functional requirements

- **Offline-first**: a full build must succeed with no network and no API
  keys (heuristic enrichment); AI is an enhancement, never a dependency.
- **Deterministic surfaces**: generated markdown carries fingerprints, not
  timestamps — reruns over an unchanged corpus produce empty diffs.
- **Dependency-light**: engine + MCP server run on pyyaml/requests +
  stdlib; the MCP server is stdlib-only.
- **Provider-agnostic AI**: Anthropic and xAI supported behind one
  interface with a mock for tests; keys via environment only.
- **Gate-friendly**: schema lint and unit suite run in the standard CI
  gate; failures block merges, not the cron.

## 6. Interfaces

```bash
python3 -m scripts.context_engine build [--ai auto|off|anthropic|xai|mock]
python3 -m scripts.context_engine sync|status|projects
python3 -m scripts.context_engine query <terms> | card <name> | facts <name> | apex
python3 scripts/schema_lint.py check .
python3 mcp/server.py        # stdio MCP; registered in .mcp.json
```

## 7. Success criteria

- Adding a project = one registry entry; the next build produces its card,
  facts, apex row, and query answers with no other edits.
- An AI client in this repo can answer "what is <project> and where are its
  docs?" from MCP alone, without cloning the project.
- Drift (structure vs SCHEMA.md, registry vs surfaces) fails the gate
  rather than silently accumulating.
- The published site home and the root README never need hand edits.

## 8. Future work

- Enrich facts from full clones (manifests, languages, git activity) during
  the aggregation window, not just the markdown mirror.
- Embedding-based retrieval behind the same `search_context` contract.
- Cross-project relationship graph (shared topics/links) as an L2 artifact.
- Fold the harmonize (Grok) corpus-reorganization system onto the same
  provider-agnostic AI layer.
