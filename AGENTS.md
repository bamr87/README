<!-- kit: sdlc v0.1.0 · AGENTS.md is the CANONICAL agent instructions file (decision D4, UPS-AGENT-07/08). -->

# README

> The bamr87 context engine: it crawls the fleet's Markdown, distills it into a context pyramid, serves it over MCP, and reviews every repository's documentation against the fleet framework.

## What this repo is

`bamr87/README` (branch `main`) is the fleet's documentation engine. It aggregates the Markdown of the projects in `_data/projects.yml` into a corpus, distills it upward (facts → cards → the apex README), builds a query index, and serves it to AI clients over MCP. Its survey reads every repository in `_data/fleet.yml` and writes two reports: `fleet_health` (scores) and `docs_review` (every repository's documents in one place, checked against the hub's documentation framework, [specs/DOCS.md](https://github.com/bamr87/bamr87/blob/main/specs/DOCS.md)). A scheduled workflow reruns the pipeline, so the context follows the fleet.

A change is done when `python tests/test_runner.py --type quick`, `python3 scripts/schema_lint.py check .`, `python3 -m scripts.context_engine navcheck` and `python3 scripts/check_tracked_surfaces.py` all pass, and the nearest `README.md` says what changed.

## Stack & commands

Python 3 (stdlib + PyYAML, requests, nltk, pytest); MkDocs Material for the site; a stdlib MCP server.

```bash
pip install -r requirements.txt                     # pip install -r requirements-docs.txt for the site
bash scripts/aggregate.sh                           # crawl the registry's repos into docs/ (self-bootstraps .venv)
python3 -m scripts.context_engine build             # rebuild the pyramid (--ai auto|off|anthropic|xai|mock)
python3 -m scripts.context_engine sync              # registry -> repos.txt
python3 -m scripts.context_engine query <terms>     # also: card / facts / apex / status / projects / nav
python3 -m scripts.context_engine survey [repo]     # fleet survey of default branches -> fleet_health + docs_review
python3 -m scripts.context_engine survey --workspace ~/github   # review local checkouts -> docs_review only
python3 -m scripts.context_engine survey --local PATH           # one working tree, nothing written
python tests/test_runner.py --type quick            # unit suite (the CI gate)
python3 scripts/schema_lint.py check .              # SCHEMA drift gate
python3 -m scripts.context_engine navcheck          # nav surfaces match the corpus (fix: rebuild)
python3 scripts/check_tracked_surfaces.py           # surfaces name only git-tracked files
bash scripts/run_doc_checks.sh [--apply]            # corpus quality checks / fixers
python3 tools/unwrap-prose.py --check               # one paragraph per line
python3 tools/docs_index.py --check                 # docs/README.md index is fresh
```

## Layout

See [`SCHEMA.md`](SCHEMA.md) and each directory's own `SCHEMA.md`. The pipeline, left to right:

| Stage | Input | Output | Entry point |
| --- | --- | --- | --- |
| Aggregate | `repos.txt` (from the registry) | `raw_docs/` | `scripts/aggregate.sh`, `aggregate.py` |
| Process | `raw_docs/` | `docs/{project}/` + front matter | `scripts/process.py` |
| Validate | `docs/` | reports, in-place fixes | `scripts/run_doc_checks.sh` |
| Index corpus | `docs/` | `docs/docs_index.json`, `docs/results/*.json` | `generate_docs_index.py`, `generate_docs_report.py` |
| Navigate | `docs/` + registry `navigation:` | `context/nav/`, `nav.yml`, `docs/browse/` | `scripts/context_engine/navigator.py` |
| Distill | corpus + registry + nav | `context/` pyramid, README AUTO span, `docs/index.md` | `python3 -m scripts.context_engine build` |
| Survey | `_data/fleet.yml` or local checkouts | `context/sources/`, `context/reports/{fleet_health,docs_review}.*` | `survey.py`, `gather/`, `analyze/` |
| Serve | `context/` | CLI and MCP answers | `cli.py`, `mcp/server.py` |

Engine modules (`scripts/context_engine/`): `registry` (registry + navigation contract) → `extractor` (facts) → `navigator` (one nav tree for `context/nav/`, `nav.yml`, `docs/browse/`) → `synthesizer` (cards) → `assembler` (apex, AUTO span, site index, context SCHEMA) → `indexer` → `query` (the one read path for CLI and MCP) → `builder`/`cli`. `ai.py` is the provider-agnostic enrichment layer. `analyze/` holds the survey checks; `analyze/framework.py` is the UPS-DOC rows and `analyze/review.py` the docs review. `scripts/harmonize/` is a legacy, optional Grok-only reorganizer outside the pipeline.

## Conventions

- **Backlog of record:** GitHub Issues with the fleet labels. **Definition of Done:** `.github/pull_request_template.md`. **Decisions:** `docs/adr/`.
- **Commits:** Conventional Commits. **Branches:** `feature/`, `fix/`, `docs/`, `refactor/`, `test/`, `chore/` off `main`. `CHANGELOG.md` is release-please's.
- **Registry first.** `_data/projects.yml` is the only hand-edited definition of what is aggregated, and it owns the navigation contract (grouping, labels, depth, exclusions). `_data/fleet.yml` is the separate, hand-maintained inventory the survey reads. Never edit `repos.txt`.
- **Generated surfaces are never hand-edited:** `context/**`, `docs/**` (the corpus, `docs/index.md`, `docs/browse/`), `repos.txt`, `nav.yml`, and the README `AUTO:projects` span. Fix the registry, the upstream repo or the engine, then rebuild. Never add a `nav:` key to `mkdocs.yml` (it would shadow the inherited one).
- **Builds succeed with no key** (heuristic mode) and are diff-stable: outputs carry corpus fingerprints, not timestamps. Keep it that way.
- **The corpus layout is the navigation contract.** `process.py` keeps each upstream's directory structure under `docs/{repo}/`; don't flatten it. Published ≠ navigable: `navigation.publish_hidden`/`navigate_hidden` and `nav.yml` `not_in_nav` declare the gap.
- **Every page must be safe in the nav:** `scripts/fix_frontmatter_icons.py` normalizes upstream `icon:` values at ingest and in `run_doc_checks.sh --apply`.
- **The MCP server is read-only**; never add write tools. It reads through `query.py`.
- **Front matter is the corpus contract** (`title`, `tags`, `category`, dates): processing scripts stay front-matter-aware and idempotent, because the `--apply` fixers run repeatedly in CI. Card and fact contracts change in `synthesizer.py`/`extractor.py`, never in their outputs.
- **Hooks** (`hooks.d/<stage>/` executables, one directory per stage in `config.HOOK_STAGES`) are non-fatal unless `CONTEXT_HOOKS_STRICT=1`.
- **Tests:** unit tests in `tests/unit/test_cases/` (unittest discovery); `test_context_engine.py` covers the engine, schema lint and MCP dispatch and `test_fleet_survey.py` the survey and the docs framework checks — extend them with the code. Integration tests (`--type integration`) clone real repos and need the network.
- **One paragraph per line** (`tools/unwrap-prose.py`, vendored — never edit it here). The crawl unwraps the corpus at ingest, because a push to `main` can only fail the prose gate.
- **SCHEMA protocol:** a structural change updates the governing `SCHEMA.md` in the same commit; `scripts/`, `_data/` and `mcp/` are `coverage: full`. New scripts fit a pipeline stage and get a row in `scripts/SCHEMA.md` and a section in `scripts/README.md`.
- **Never:** push to `main`, commit lockfiles or secrets, suppress type errors, leave empty exception handlers, or edit generated files by hand.
- `PRD.md` is the engine's product spec (v2); [`PLAN.md`](PLAN.md) is the v3 redesign (check catalogue, roadmap) — read it before structural work and update its roadmap when a phase ships. [`MKDOCS.md`](MKDOCS.md) documents the site and its generated navigation.

## CI and the site

- `aggregate-docs.yaml` (weekly + manual): sync → crawl → corpus index → build (AI enrichment when keys exist) → schema lint → commit. `docs/` and `context/` churn on their own; treat them as build artifacts.
- `docs-quality-check.yaml` (PRs, `quality/*`): schema lint, `navcheck`, `check_tracked_surfaces.py`, then doc lint and front matter checks.
- `deploy-pages.yaml`: builds MkDocs Material (not `--strict`; aggregated pages carry expected broken cross-references) and publishes `docs/` to Pages. `ci.yml` calls the hub's `standard-ci.yml`.
- `docker-compose.yml` runs Wiki.js + Postgres (`scripts/wiki-manage.sh`, [`WIKIJS-QUICKSTART.md`](WIKIJS-QUICKSTART.md)); copy `.env.example` to `.env` first.

## Fleet context

A submodule of [bamr87/bamr87](https://github.com/bamr87/bamr87): commit and push here first, then the hub bumps its pointer. The hub owns the standards this repo checks (`specs/`, including the documentation framework), and the tools it vendors (`tools/unwrap-prose.py`, `tools/docs_index.py`) stay byte-identical to the hub's copies. The fleet-pulse doctor and the hub's issue pipeline act on this repo like any other.

## Standard deviations

- UPS-DOC-04: `docs/` is the generated MkDocs corpus, so this repository's own operator docs (`PLAN.md`, `MKDOCS.md`, `WIKIJS-QUICKSTART.md`) stay at the root. Its docs index covers the root and `docs/adr/` only.

## Governance

Read [`docs/constitution.md`](docs/constitution.md) before changing anything: it is the highest-precedence rule set here and wins over this file when they disagree. It changes only through a numbered record in [`docs/amendments/`](docs/amendments/), ratified by the maintainer merging the PR; agents propose, never merge. Every user-facing feature has a stable id in [`features/features.yml`](features/features.yml) with `status`, location and the PRD requirement ids it serves; the PRD's "Feature catalog" block is generated from it (`python3 <bamr87/bamr87>/tools/governance_lint.py prd-sync . --write`; check with `… check .`). Never hand-edit that block or `CHANGELOG.md`.
