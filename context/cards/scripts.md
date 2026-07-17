---
title: "scripts directory"
repo: bamr87/scripts
category: project-card
kind: tooling
status: active
generated: true
generated_by: context_engine 1.0.0
enrichment: heuristic
source_fingerprint: 583bc229e309e2b6
tags:
  - automation
  - bash
  - python
---

# scripts directory

> Automation scripts for forking, linting, stashing, and project management across the fleet. This directory contains project scripts used for automation and development tasks. It is intentionally tracked in the repository so collaborators can run and maintain these utilities.

| | |
|---|---|
| Repository | [bamr87/scripts](https://github.com/bamr87/scripts) |
| Kind | tooling |
| Status | active |
| Branch | default |
| Corpus | `docs/scripts` - 14 docs |
| External | no |

## Signals

- no governance signal files detected in the corpus
- ~16,570 words across 14 indexed documents
- code samples in: bash, plaintext, yaml

## Structure

- `FORKME/` (7 docs)
- `STASHME/` (4 docs)
- `linting/` (1 docs)

## Key documents

- [`README.md`](../../docs/scripts/README.md)
- [`FORKME/FORKME.md`](../../docs/scripts/FORKME/FORKME.md)
- [`FORKME/FORKME-IMPLEMENTATION-SUMMARY.md`](../../docs/scripts/FORKME/FORKME-IMPLEMENTATION-SUMMARY.md)
- [`FORKME/FORKME-EXAMPLES.md`](../../docs/scripts/FORKME/FORKME-EXAMPLES.md)
- [`FORKME/IMPROVEMENTS.md`](../../docs/scripts/FORKME/IMPROVEMENTS.md)
- [`FORKME/REVIEW-SUMMARY.md`](../../docs/scripts/FORKME/REVIEW-SUMMARY.md)
- [`STASHME/STASHME-EXAMPLES.md`](../../docs/scripts/STASHME/STASHME-EXAMPLES.md)
- [`STASHME/STASHME.md`](../../docs/scripts/STASHME/STASHME.md)

## Query this context

```bash
python3 -m scripts.context_engine query scripts
python3 -m scripts.context_engine facts scripts
```

MCP: `get_project` with `{"name": "scripts"}` (server: `mcp/server.py`, registered in `.mcp.json`).
