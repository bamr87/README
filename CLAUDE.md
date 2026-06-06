# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`bamr87/README` (branch `main`) — a **documentation aggregation pipeline**. It clones a list of external repos, extracts their Markdown, normalizes it, validates quality, builds a searchable index, and optionally runs an AI harmonization pass. The output (`docs/`) is what the parent monorepo's MkDocs site publishes (`docs_dir: README/docs` in the root `mkdocs.yml`).

> This is one submodule of the `bamr87/bamr87` monorepo. The repo you're editing here is `bamr87/README`. Commit here, push to `bamr87/README`, *then* bump the pointer in the parent — see the parent `../CLAUDE.md` for the submodule workflow. The aspirational top-level `README.md` (templates/, knowledge/, ai/ tree) describes the *parent* vision and does **not** reflect this repo's actual contents — trust `scripts/README.md` and `PRD.md` instead.

## The pipeline (core architecture)

Everything flows left-to-right; each stage's output is the next stage's input. Understanding this ordering is the key to being productive — the scripts are stages, not a flat utility bag.

| Stage | Input | Output | Entry point |
|-------|-------|--------|-------------|
| 1. Aggregate | `repos.txt` | `temp/` (clones) → `raw_docs/` | `scripts/aggregate.sh` (orchestrator) + `scripts/aggregate.py` (repo ops module) |
| 2. Process | `raw_docs/` | `docs/{repo_name}/` + YAML frontmatter | `scripts/process.py` |
| 3. Validate / fix | `docs/` | reports + in-place fixes | `scripts/run_doc_checks.sh` → `lint_docs.py`, `check_frontmatter.py`, and `--apply` fixers |
| 4. Index / report | `docs/` | `docs/docs_index.json`, `docs/results/*.json` | `generate_docs_index.py`, `generate_docs_report.py`, `mkdocs_quality_report.py` |
| 5. Harmonize (AI) | `docs/` | reorganized docs + session files | `scripts/harmonize_docs.py` → `scripts/harmonize/` package |

- `repos.txt` is the source-of-truth input: one repo URL per line, `#` comments, optional `url#branch` syntax (e.g. `...OverTheWire-website#gh-pages`).
- Output layout (per the current `refactor/simplify-docs-output` work) is **flat repo-based**: `docs/{repo_name}/...` preserving each source's internal tree. There are two aggregators — `process.py` (the simple repo-keyed one in use) and `aggregate_mkdocs.py` (a `MkDocsAggregator` class that buckets by `CATEGORY_MAPPING`); know which one a task targets before editing.
- The `docs/` subdirectories (`it-journey/`, `bashcrawl/`, `zer0-mistakes/`, `wargames/`, `OverTheWire-website/`, `scripts/`, `skills/`, …) are **generated aggregation output**, not hand-authored source. Don't hand-edit them to "fix" content — fix the upstream repo or the processing script.

### The AI harmonization subsystem (`scripts/harmonize/`)

A self-contained package that calls **xAI's Grok API** (not Anthropic) to analyze and reorganize docs. CLI is `harmonize_docs.py`; it is session-based (`--scope`, `--batch-size`, `--resume <session-id>`, `--list-sessions`, `--report`, `--apply --dry-run`). Modules: `schemas.py` (tool/JSON-schema definitions + `SYSTEM_PROMPT`), `analyzer.py`, `grok_agent.py` (the API client), `engine.py` (orchestration), `processor.py`. Requires a Grok API key in the environment; it's optional and gated off the main pipeline.

## Commands

```bash
# Full aggregation (clones every repo in repos.txt; self-bootstraps a .venv if pyyaml/requests missing)
bash scripts/aggregate.sh

# Process raw_docs/ → docs/
python3 scripts/process.py

# Quality: lint + frontmatter check (read-only); add --apply to auto-fix whitespace/tags/h1/frontmatter
bash scripts/run_doc_checks.sh
bash scripts/run_doc_checks.sh --apply

# Regenerate the index and reports consumed by the MkDocs site
python3 scripts/generate_docs_index.py
python3 scripts/generate_docs_report.py
```

Dependencies: `pip install -r requirements.txt` (pyyaml, requests, nltk, pytest). A `.venv/` already exists in-tree — `source .venv/bin/activate`.

### Tests

The intended runner is the **custom harness**, not bare pytest:

```bash
python tests/test_runner.py                 # unit + integration
python tests/test_runner.py --type unit     # unit only
python tests/test_runner.py --type quick    # fast path (unit only)
python tests/test_runner.py --type integration --repos https://github.com/octocat/Hello-World
```

Integration tests **clone real GitHub repos** (configured in `tests/config.py` `TEST_CONFIG["test_repos"]`) — they need network access and are slow (300s timeout per repo). Results are written to `tests/results/`.

`pytest tests/` partially works but currently fails collection: `tests/unit/test_cases/test_categorization.py` imports `categorize_content`/`generate_tags`/`generate_summary` from `scripts.process`, which the docs-output refactor removed — so those unit tests have drifted out of sync with the code. When touching `process.py`, expect to reconcile these tests rather than assume green pytest. Run a single test once fixed with `pytest tests/unit/test_cases/test_file_processing.py::TestName -v`.

## CI workflows (`.github/workflows/`)

- `aggregate-docs.yaml` — daily cron (+ manual) runs `scripts/aggregate.sh` and auto-commits the regenerated `docs/` to `main`. This is why `docs/` churns on its own; treat it as a build artifact.
- `docs-quality-check.yaml` — on PRs to `main` and pushes to `quality/*`: runs lint + frontmatter checks, uploads `docs/results/docs_quality_report.json`, and comments on the PR.
- `docs-apply-fixes.yaml` — on `quality/*` pushes: runs `run_doc_checks.sh --apply` and opens a PR with the auto-fixes. The `quality/*` branch prefix is the trigger convention for fix automation.
- `deploy-pages.yaml` — on pushes to `main` touching `docs/**`, `mkdocs.yml`, or `requirements-docs.txt` (+ manual): builds the MkDocs Material site (`mkdocs build`, **not** `--strict` — aggregated docs carry many expected broken cross-references) and publishes it to GitHub Pages via `actions/deploy-pages`. One-time setup: repo Settings → Pages → Source = "GitHub Actions". Published at `https://bamr87.github.io/README/`.

## Wiki.js / Docker

`docker-compose.yml` here runs a **Wiki.js + Postgres** stack (distinct from the parent monorepo's compose). It mounts this repo's `./docs` read-only into the wiki container. `scripts/wiki-manage.sh {start|stop|backup|restore|update|shell|db-shell|admin|...}` is the management wrapper. Copy `.env.example` → `.env` first. Ports default to wiki `3000`, pgAdmin `5050` (under the `admin` profile).

## Conventions specific to this repo

- Frontmatter is the contract: processing scripts read/write YAML frontmatter (`title`, `description`, `tags`, `category`, dates). `check_frontmatter.py` enforces it; `clean_frontmatter.py`/`normalize_tags.py`/`fix_h1.py` normalize it. When adding a doc-processing script, keep it frontmatter-aware and idempotent (the `--apply` fixers are run repeatedly in CI).
- New utility scripts belong under `scripts/` and should fit a pipeline stage; update `scripts/README.md` (the per-directory README is kept current as part of the change — README-First/README-Last house rule from the parent repo).
- `PRD.md` is the original MVP spec; `MKDOCS.md` documents the site build. This repo now has its **own** standalone `mkdocs.yml` (`docs_dir: docs`, `site_url: https://bamr87.github.io/README/`) deployed by `deploy-pages.yaml`; the parent monorepo separately builds the same `docs/` tree under its own root `mkdocs.yml`.
