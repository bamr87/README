---
schema: "0.1"
coverage: full
---

# SCHEMA — scripts

> Pipeline stages, the context engine, and the gates. Scripts are stages,
> not a flat utility bag — see the stage table in `README.md`.

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `README.md` | file | Stage-by-stage script documentation | required |
| `SCHEMA.md` | file | This file | required |
| `aggregate.py` | file | Repo-operations module (clone/pull/find/copy docs) | required |
| `aggregate.sh` | file | Stage 1-2 orchestrator: repos.txt → raw_docs/ → docs/ | required |
| `aggregate_mkdocs.py` | file | Alternative category-bucketing aggregator (MkDocsAggregator) | |
| `analyze_doc_structure.py` | file | Corpus structure analysis utility | |
| `check_frontmatter.py` | file | Frontmatter validator (+ --fix) | required |
| `clean_frontmatter.py` | file | Frontmatter normalizer | |
| `cleanup_docs.py` | file | Corpus cleanup utility | |
| `context_engine/` | dir | Stage 5: the context engine package (extract→synthesize→assemble→index) | required terminal |
| `fix_h1.py` | file | H1 heading fixer | |
| `fix_mkdocs_links.py` | file | MkDocs link converter/validator | |
| `fix_whitespace.py` | file | Trailing-whitespace fixer | |
| `generate_docs_index.py` | file | Stage 4: corpus index (docs/docs_index.json) | required |
| `generate_docs_report.py` | file | Quality report generator (docs/results/) | required |
| `harmonize/` | dir | AI harmonization package (Grok-based corpus reorganization) | terminal |
| `harmonize_docs.py` | file | AI harmonization CLI (session-based) | |
| `lint_docs.py` | file | Markdown linter | required |
| `mkdocs_quality_report.py` | file | MkDocs compatibility/quality analyzer | |
| `normalize_tags.py` | file | Tag normalizer | |
| `process.py` | file | Stage 2: raw_docs/ → docs/{repo}/ with frontmatter | required |
| `run_doc_checks.sh` | file | Stage 3 orchestrator: lint + fixers (+ --apply) | required |
| `schema_lint.py` | file | SCHEMA.md pyramid drift gate (`check .`) | required |
| `wiki-manage.sh` | file | Wiki.js stack management wrapper | |

## Placement

- New pipeline stage or gate → a script here + a row in this table + a
  section in `README.md` (README-First house rule).
- New engine module → `context_engine/` (documented in that package's
  docstrings; the package is a `terminal` boundary here).

## Forbidden

- No generated artifacts in `scripts/` — outputs belong in `docs/`,
  `context/`, or `tests/results/`.
