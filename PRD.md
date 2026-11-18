# PRD — README context engine (v2)

> v2 repurposes this repository from a generic documentation aggregator
> (the v1 MVP, preserved in git history) into the **consolidated README of
> the bamr87/bamr87 monorepo**: a dedicated, continuously evolving context
> engine — MCP- and AI-augmented — that describes every submodule in the
> fleet and can be queried by humans, CI, and AI agents.

**Backlog of record:** https://github.com/bamr87/README/issues (GitHub Issues with the fleet labels). This PRD says what the engine must do; the work itself is tracked as issues, never as a list here.

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
| Navigation | `context/nav/<project>.json` + `nav.yml` + `docs/browse/**` | readers browsing the site, and any other frontend | navigator |
| Query | `context/index/` + CLI + MCP server | everyone | indexer + `mcp/server.py` |

Supporting contracts:

- **Registry as source of truth** — `_data/projects.yml`; `repos.txt` and every generated surface are regenerated from it, never hand-edited.
- **SCHEMA.md pyramid** — every governed directory carries a SCHEMA.md
(structure table, placement, forbidden); `scripts/schema_lint.py check .` is the drift gate, wired into CI, matching the parent monorepo protocol.
- **Navigation contract** — the `navigation:` block in `_data/projects.yml`
(grouping, section labels, depth cap, exclusions) plus each corpus's own folder hierarchy. The sidebar is *derived* from these two; it is never curated by hand, so it cannot drift from what is published.
- **Hooks** — `hooks.d/<stage>/` executables run at each engine stage, the extension point for AI orchestration around the pipeline.

## 4. Functional requirements

Requirement ids are stable: features cite them in `features/features.yml` (`prd:`), and an id is never renumbered or reused.

- **FR1 · Crawl**: aggregate markdown from every active registry project (clone/pull, branch pins, external repos) — stages 1–3 (existing).
- **FR2 · Extract**: derive per-project facts offline from the corpus: identity (title/summary/headings), governance signals (SCHEMA.md, CLAUDE.md, AGENTS.md, …), structure, rollups (tags/categories/languages/words), key documents, and a corpus fingerprint for change detection.
- **FR3 · Navigate**: turn each corpus's folder hierarchy into one canonical navigation tree — sections from folders, landing pages from `index.md`/`README.md`, labels from frontmatter titles, ordering from frontmatter and the registry, grouping from `nav.groups` — and render it to three surfaces: `context/nav/*.json` (frontend-agnostic), `nav.yml` (the MkDocs sidebar plus the matching `exclude_docs`), and `docs/browse/*.md` (human content maps). No sidebar entry may point at a page the reader cannot open, and any published page deliberately left out of the sidebar must be declared as such (`not_in_nav`) rather than silently orphaned.
- **FR4 · Synthesize**: render facts into per-project cards with a frontmatter contract; optionally AI-enrich the essence paragraph.
- **FR5 · Assemble**: build the consolidated apex README; inject the fleet table into the root README `AUTO:projects` span; mirror the fleet overview to the published site home (`docs/index.md`).
- **FR6 · Index**: build a term index + manifest so queries need no rescan; navigation section titles are indexed alongside cards and facts.
- **FR7 · Serve**: answer queries via CLI (`query/card/facts/nav/apex/status/projects`) and via MCP (`list_projects`, `get_project`, `search_context`, `get_readme`, `get_nav`, `get_schema`, `context_status` + `context://` resources).
- **FR8 · Evolve**: scheduled CI re-crawls, rebuilds, schema-lints, and commits; hooks allow agents to extend every build.
- **FR9 · Read a document** (planned, README-010, #59): an MCP `get_doc` tool returns one indexed corpus page by path, confined to `docs/` and capped in size, so a client can follow a `search_context`/`get_nav` pointer without leaving MCP.
- **FR10 · Provenance** (planned, README-011, #60): every MCP answer carries its source (engine or upstream repo), commit, path, enrichment mode and a trust marker, with upstream text fenced as untrusted data.
- **FR11 · Survey and docs review**: survey the documentation of every repository in the fleet inventory (`_data/fleet.yml`) on its default branch — a shallow clone each, run through the registered checks and scored — and write a manifest per repository (`context/sources/<name>.json`), the health report (`context/reports/fleet_health.{json,md}`) and the docs review (`context/reports/docs_review.{json,md}`): every repository's documents in one place, checked against the hub's documentation framework (`specs/DOCS.md`). `survey --workspace DIR` reviews the local checkouts under `DIR`, each on its current branch, and writes only the docs review; `survey --local PATH` checks one working tree and writes nothing. The survey never touches the corpus, the navigation surfaces or the pyramid.

## 5. Non-functional requirements

- **NFR1 · Offline-first**: a full build must succeed with no network and no API keys (heuristic enrichment); AI is an enhancement, never a dependency.
- **NFR2 · Deterministic surfaces**: generated markdown carries fingerprints, not timestamps — reruns over an unchanged corpus produce empty diffs.
- **NFR3 · Dependency-light**: engine + MCP server run on pyyaml/requests + stdlib; the MCP server is stdlib-only.
- **NFR4 · Provider-agnostic AI**: Anthropic and xAI supported behind one interface with a mock for tests; keys via environment only.
- **NFR5 · Gate-friendly**: schema lint and unit suite run in the standard CI gate; failures block merges, not the cron.
- **NFR6 · Navigable by construction**: a page that cannot be placed in a navigation entry is a corpus defect, not a nav exception. Frontmatter that breaks nav rendering (an unresolvable `icon:`) is normalized at ingest.

## 6. Interfaces

The commands and gates `AGENTS.md` names (§ Stack & commands):

```bash
# pipeline and queries
bash scripts/aggregate.sh                                # crawl the registry's repos into docs/ (FR1)
python3 -m scripts.context_engine build [--ai auto|off|anthropic|xai|mock]
python3 -m scripts.context_engine sync|status|projects
python3 -m scripts.context_engine query <terms> | card <name> | facts <name> | apex
python3 -m scripts.context_engine nav [<name>] [--depth N] [--json]
python3 -m scripts.context_engine fleet [--json]         # the survey's inventory (_data/fleet.yml)
python3 -m scripts.context_engine survey [repo ...]      # default branches -> fleet_health + docs_review (FR11)
python3 -m scripts.context_engine survey --workspace DIR # local checkouts -> docs_review only
python3 -m scripts.context_engine survey --local PATH    # one working tree, nothing written
python3 mcp/server.py                                    # stdio MCP; registered in .mcp.json

# gates
python tests/test_runner.py --type quick                 # unit suite (the CI gate)
python3 scripts/schema_lint.py check .                   # SCHEMA drift gate
python3 -m scripts.context_engine navcheck               # nav surfaces match the corpus (fix: rebuild)
python3 scripts/check_tracked_surfaces.py                # surfaces name only git-tracked files
bash scripts/run_doc_checks.sh [--apply]                 # corpus quality checks / fixers
python3 tools/unwrap-prose.py --check --exclude '(^|/)SCHEMA\.md$' --exclude '(^|/)CHANGELOG\.md$' --exclude '^docs/'   # one paragraph per line
python3 tools/docs_index.py --check                      # docs/README.md index is fresh
```

## Feature catalog

<!-- features:start v1 · generated by bamr87/bamr87 tools/governance_lint.py prd-sync from features/features.yml — edit the catalog, then re-run; do not edit this table by hand -->
Every user-facing capability has a stable id in the feature catalog [`features/features.yml`](features/features.yml). Each entry names the PRD requirements it serves (`prd:`); the trace below is the reverse view.

| ID | Feature | Status | Where | Requirements |
| --- | --- | --- | --- | --- |
| [README-001](features/features.yml) | Crawl | shipped | [`scripts`](scripts) · [`PRD.md`](PRD.md) | FR1 |
| [README-002](features/features.yml) | Extract | shipped | [`context`](context) · [`PRD.md`](PRD.md) | FR2 |
| [README-003](features/features.yml) | Navigate | shipped | [`context`](context) · [`PRD.md`](PRD.md) | FR3 |
| [README-004](features/features.yml) | Synthesize | shipped | [`context`](context) · [`PRD.md`](PRD.md) | FR4 |
| [README-005](features/features.yml) | Assemble | shipped | [`context`](context) · [`PRD.md`](PRD.md) | FR5 |
| [README-006](features/features.yml) | Index | shipped | [`context`](context) · [`PRD.md`](PRD.md) | FR6 |
| [README-007](features/features.yml) | Serve | shipped | [`mcp`](mcp) · [`PRD.md`](PRD.md) | FR7 |
| [README-008](features/features.yml) | Evolve | shipped | [`hooks.d`](hooks.d) · [`PRD.md`](PRD.md) | FR8 |
| [README-009](features/features.yml) | Published fleet documentation site | shipped | route `/` · [`MKDOCS.md`](MKDOCS.md) | FR3, FR5 |
| [README-010](features/features.yml) | MCP get_doc tool | planned | [`mcp/server.py`](mcp/server.py) · [`mcp/README.md`](mcp/README.md) | FR9 |
| [README-011](features/features.yml) | MCP provenance and trust markers | planned | [`mcp/server.py`](mcp/server.py) · [`mcp/README.md`](mcp/README.md) | FR10 |
| [README-012](features/features.yml) | Fleet survey and docs review | shipped | [`scripts/context_engine/survey.py`](scripts/context_engine/survey.py) · [`README.md`](README.md) | FR11 |

**Requirement → feature trace**

| Requirement | Features |
| --- | --- |
| FR1 | README-001 |
| FR2 | README-002 |
| FR3 | README-003, README-009 |
| FR4 | README-004 |
| FR5 | README-005, README-009 |
| FR6 | README-006 |
| FR7 | README-007 |
| FR8 | README-008 |
| FR9 | README-010 |
| FR10 | README-011 |
| FR11 | README-012 |
<!-- features:end -->

## 7. Success criteria

- Adding a project = one registry entry; the next build produces its card, facts, apex row, and query answers with no other edits.
- An AI client in this repo can answer "what is <project> and where are its docs?" from MCP alone, without cloning the project.
- Drift (structure vs SCHEMA.md, registry vs surfaces) fails the gate rather than silently accumulating.
- The published site home and the root README never need hand edits.
- Every published page is reachable from the sidebar in at most `max_depth`
clicks, and the sidebar needs no hand edits when a corpus gains or loses folders — `mkdocs build` reports no "pages not included in the nav".

## 8. Future work

- Enrich facts from full clones (manifests, languages, git activity) during the aggregation window, not just the markdown mirror.
- Embedding-based retrieval behind the same `search_context` contract.
- Cross-project relationship graph (shared topics/links) as an L2 artifact.
- A second frontend over `context/nav/*.json` (the trees are renderer- agnostic on purpose) — e.g. the Wiki.js stack or a static SPA.
- Fold the harmonize (Grok) corpus-reorganization system onto the same provider-agnostic AI layer.
