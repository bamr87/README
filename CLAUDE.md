# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`bamr87/README` (branch `main`) — the **consolidated README / context engine** of the bamr87 monorepo. It crawls the fleet of project repos listed in the registry, aggregates their Markdown into a corpus, distills that corpus upward into a **context pyramid** (facts → cards → consolidated apex README), builds a query index, and serves the whole thing to AI clients over **MCP**. Scheduled CI reruns the pipeline, so the context continuously evolves with the fleet.

> This is one submodule of the `bamr87/bamr87` monorepo. Commit here, push to `bamr87/README`, *then* bump the pointer in the parent — see the parent `../CLAUDE.md` for the submodule workflow. This repo follows the parent's **SCHEMA protocol**: every governed directory carries a `SCHEMA.md`, and `python3 scripts/schema_lint.py check .` is the drift gate (run it before committing structural changes).

## The pipeline (core architecture)

Everything flows left-to-right; each stage's output is the next stage's input. Stages 1–4 build the corpus (unchanged from the original aggregator); stages 5–6 are the context engine.

| Stage | Input | Output | Entry point |
|-------|-------|--------|-------------|
| 1. Aggregate | `repos.txt` (generated from registry) | `temp/` → `raw_docs/` | `scripts/aggregate.sh` + `scripts/aggregate.py` |
| 2. Process | `raw_docs/` | `docs/{project}/` + YAML frontmatter | `scripts/process.py` |
| 3. Validate / fix | `docs/` | reports + in-place fixes | `scripts/run_doc_checks.sh` → `lint_docs.py`, `check_frontmatter.py`, `--apply` fixers |
| 4. Index corpus | `docs/` | `docs/docs_index.json`, `docs/results/*.json` | `generate_docs_index.py`, `generate_docs_report.py` |
| 5. Distill (engine) | corpus + `_data/projects.yml` | `context/` pyramid + README AUTO span + `docs/index.md` | `python3 -m scripts.context_engine build` |
| 6. Serve | `context/` | CLI + MCP answers | `scripts/context_engine/cli.py`, `mcp/server.py` |

### Source of truth and generated surfaces

- **`_data/projects.yml` is the fleet registry** — the only hand-edited definition of what the engine describes. `repos.txt` is *generated* from it (`context_engine sync`).
- **Generated surfaces — never hand-edit**: `context/**`, `docs/**` (including `docs/index.md`), `repos.txt`, and the `AUTO:projects` span in the root `README.md`. Fix the registry, the upstream repo, or the engine, then rebuild.
- The pyramid: `docs/` (L3 corpus) → `context/facts/*.json` (L2) → `context/cards/*.md` (L1) → `context/README.md` (L0 apex, mirrored to `docs/index.md` for the published site).

### The context engine (`scripts/context_engine/`)

Package layout: `registry.py` (load/validate registry, sync repos.txt) → `extractor.py` (corpus → facts; reuses `docs_index.json` rollups) → `synthesizer.py` (facts → cards) → `assembler.py` (apex, AUTO span injection, site index, context SCHEMA) → `indexer.py` (term index + manifest) → `query.py` (read-side API shared by CLI and MCP) → `builder.py`/`cli.py` (orchestration + CLI). `ai.py` is the provider-agnostic enrichment layer (Anthropic via `ANTHROPIC_API_KEY`, xAI via `XAI_API_KEY`/`GROK_API_KEY`, `mock` for tests); builds **must always succeed with no key** (heuristic mode). `hooks.py` runs `hooks.d/<stage>/` executables at each stage (non-fatal unless `CONTEXT_HOOKS_STRICT=1`). Generated markdown carries corpus fingerprints, not timestamps — reruns over an unchanged corpus produce empty diffs (keep it that way).

### The MCP server (`mcp/server.py`)

Stdlib-only, stdio, newline-delimited JSON-RPC; registered in `.mcp.json` (project scope, so Claude Code auto-discovers it here). Read-only by design: tools `list_projects`, `get_project`, `search_context`, `get_readme`, `get_schema`, `context_status`; resources `context://...`. It reads through `scripts/context_engine/query.py` — one code path for CLI and MCP. Never add write/mutate tools.

### The AI harmonization subsystem (`scripts/harmonize/`)

Legacy-but-functional corpus reorganization package calling **xAI's Grok API** directly (predates `context_engine/ai.py`). CLI `harmonize_docs.py`, session-based (`--scope`, `--resume`, `--apply --dry-run`, `--mock`). Optional and gated off the main pipeline; requires a Grok key.

## Commands

```bash
# Full crawl (clones every registry repo; self-bootstraps .venv if needed)
bash scripts/aggregate.sh

# Corpus quality: read-only checks; --apply auto-fixes whitespace/tags/h1/frontmatter
bash scripts/run_doc_checks.sh [--apply]

# Corpus index consumed by the engine and the site
python3 scripts/generate_docs_index.py

# Context engine (stage 5-6)
python3 -m scripts.context_engine build          # full pyramid rebuild (--ai auto|off|anthropic|xai|mock)
python3 -m scripts.context_engine sync           # registry -> repos.txt
python3 -m scripts.context_engine query <terms>  # search; also: card/facts/apex/status/projects

# Drift gate (run before committing structural changes)
python3 scripts/schema_lint.py check .
```

Dependencies: `pip install -r requirements.txt` (pyyaml, requests, nltk, pytest). A `.venv/` may exist in-tree — `source .venv/bin/activate`.

### Tests

The intended runner is the **custom harness**, not bare pytest:

```bash
python tests/test_runner.py                 # unit + integration
python tests/test_runner.py --type quick    # fast path (unit only) — the CI gate
python tests/test_runner.py --type integration --repos https://github.com/octocat/Hello-World
```

Unit tests live in `tests/unit/test_cases/` (unittest discovery; `tests/unit/test_cases/test_context_engine.py` covers the engine, schema lint, and MCP dispatch against fixtures — extend it when touching those). Integration tests **clone real GitHub repos** (`tests/config.py`), need network, and are slow. Results land in `tests/results/` (generated).

## CI workflows (`.github/workflows/`)

- `aggregate-docs.yaml` — weekly cron (+ manual): registry sync → `aggregate.sh` → corpus index → **context engine build** (AI enrichment auto-enables when `ANTHROPIC_API_KEY`/`XAI_API_KEY` secrets exist) → schema lint → auto-commit to `main`. This is why `docs/`, `context/`, and the README span churn on their own; treat them as build artifacts.
- `docs-quality-check.yaml` — PRs to `main` and `quality/*` pushes: **schema lint drift gate**, then doc lint + frontmatter checks, report artifact + PR comment.
- `ci.yml` — thin caller of the parent's shared `standard-ci.yml` gate; don't edit the logic here.
- `deploy-pages.yaml` — pushes to `main` touching `docs/**`: builds the MkDocs Material site (**not** `--strict`; aggregated docs carry expected broken cross-references) and publishes to GitHub Pages. `docs/index.md` (the site home) is generated by the engine.

## Wiki.js / Docker

`docker-compose.yml` runs a **Wiki.js + Postgres** stack (distinct from the parent monorepo's compose). It mounts `./docs` read-only into the wiki container. `scripts/wiki-manage.sh {start|stop|backup|...}` is the wrapper. Copy `.env.example` → `.env` first. Ports: wiki `3000`, pgAdmin `5050` (profile `admin`).

## Conventions specific to this repo

- **Registry first**: adding/removing a fleet project = edit `_data/projects.yml`, run `sync`, rebuild. Never edit `repos.txt` by hand.
- **SCHEMA protocol**: structural changes (new top-level entry, new script, new registry) require updating the governing `SCHEMA.md` table in the same change; the lint gate enforces existence and, where `coverage: full`, exact listings (`scripts/`, `_data/`, `mcp/`).
- Frontmatter is the corpus contract (`title`, `tags`, `category`, dates); processing scripts stay frontmatter-aware and idempotent (the `--apply` fixers run repeatedly in CI). Cards/facts have their own frontmatter/JSON contracts — change them in `synthesizer.py`/`extractor.py`, not by editing outputs.
- New utility scripts belong under `scripts/`, must fit a pipeline stage, and get a row in `scripts/SCHEMA.md` + a section in `scripts/README.md` (README-First/README-Last house rule from the parent repo).
- `PRD.md` is the context-engine product spec (v2; the v1 aggregator MVP is in git history). `MKDOCS.md` documents the site build. This repo has its **own** `mkdocs.yml` (`docs_dir: docs`) deployed by `deploy-pages.yaml`; the parent monorepo separately builds the same `docs/` tree under its root `mkdocs.yml`.
