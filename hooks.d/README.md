# Context-engine hooks

Executable files in `hooks.d/<stage>/` run at that stage of every
`python3 -m scripts.context_engine build`, in lexical order. They are the
extension point for AI orchestration and automation around the pipeline:
notify an agent, post-process the pyramid, gate the build — without
touching engine code.

## Contract

| Aspect | Behavior |
|---|---|
| Discovery | `hooks.d/<stage>/*`, executable bit required, lexical order (`NN-name`) |
| Working dir | repo root |
| Environment | `CONTEXT_ROOT`, `CONTEXT_STAGE`, `CONTEXT_ENGINE_VERSION`, `CONTEXT_ENRICHMENT` |
| Timeout | 120s per hook |
| Failure | logged, build continues — unless `CONTEXT_HOOKS_STRICT=1` |

## Stages

`pre_build` → *(sync, extract)* → `post_extract` → *(cards)* →
`post_synthesize` → *(apex, README span, site index)* → `post_assemble` →
*(query index)* → `post_index` → `post_build`

## Shipped hooks

- `post_index/50-freshness-report.py` — renders `context/index/freshness.md`
  from the manifest so humans (and agents) can see at a glance when each
  layer was last regenerated.
- `post_build/90-schema-lint.sh` — runs the SCHEMA.md pyramid drift gate
  over the repo after every build.

Skipping hooks: `python3 -m scripts.context_engine build --no-hooks`.
