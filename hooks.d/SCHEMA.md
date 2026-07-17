---
schema: "0.1"
coverage: listed
---

# SCHEMA — hooks.d

> Lifecycle hooks the context engine executes at each build stage —
> the extension point for AI orchestration and automation around the
> pipeline without editing engine code.

## Conventions

- One directory per stage; executable files run in lexical order
  (`NN-name` prefix convention). Non-executable files are skipped.
- Hooks receive `CONTEXT_ROOT`, `CONTEXT_STAGE`, `CONTEXT_ENGINE_VERSION`,
  and `CONTEXT_ENRICHMENT` in the environment and run from the repo root.
- Failures are reported but non-fatal; set `CONTEXT_HOOKS_STRICT=1` to make
  a failing hook abort the build.
- Stages: `pre_build`, `post_extract`, `post_synthesize`, `post_assemble`,
  `post_index`, `post_build`.

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `SCHEMA.md` | file | This file | required |
| `README.md` | file | Hook-authoring guide | required |
| `post_index/` | dir | Hooks after the query index is written | |
| `post_build/` | dir | Hooks after the full pipeline completes | |

## Placement

- New hook → `hooks.d/<stage>/NN-name` (executable), documented in README.md.
- New stage → `HOOK_STAGES` in `scripts/context_engine/config.py`, then a
  directory here.
