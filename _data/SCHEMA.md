---
schema: "0.1"
coverage: full
---

# SCHEMA — _data

> Registries: the structural source of truth that every generated surface
> (context pyramid, README span, repos.txt) is regenerated from.

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `SCHEMA.md` | file | This file | required |
| `projects.yml` | file | Fleet registry — one entry per submodule the engine describes | required |

## Placement

- New registry → a new `*.yml` here, documented in this table and consumed
  via `scripts/context_engine/registry.py`.

## Forbidden

- No generated data here — registries are hand-maintained inputs; generated
  artifacts belong under `context/`.
