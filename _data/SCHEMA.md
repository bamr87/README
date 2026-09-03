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
| `projects.yml` | file | Fleet registry — one entry per submodule, plus the `navigation:` contract that shapes the published sidebar | required |

## Placement

- New registry → a new `*.yml` here, documented in this table and consumed
  via `scripts/context_engine/registry.py`.
- New sidebar grouping, section label, depth cap or exclusion → the
  `navigation:` block or a project's `nav:` in `projects.yml`. These are
  inputs, not outputs: `nav.yml`, `context/nav/` and `docs/browse/` are all
  regenerated from them.

## Forbidden

- No generated data here — registries are hand-maintained inputs; generated
  artifacts belong under `context/`.
