# Context-engine hooks

Executable files in `hooks.d/<stage>/` run at that stage of every `python3 -m scripts.context_engine build`, in lexical order. They are the extension point for AI orchestration and automation around the pipeline: notify an agent, post-process the pyramid, gate the build — without touching engine code.

## Contract

| Aspect | Behavior |
|---|---|
| Discovery | `hooks.d/<stage>/*`, executable bit required, lexical order (`NN-name`) |
| Working dir | repo root |
| Environment | `CONTEXT_ROOT`, `CONTEXT_STAGE`, `CONTEXT_ENGINE_VERSION`, `CONTEXT_ENRICHMENT`, plus an allowlist of the build's environment (below), never all of it |
| Output | stdout + stderr, secret-screened (`scripts/context_engine/redact.py`) before it is logged; the first 10 lines are printed |
| Timeout | 120s per hook |
| Failure | logged, build continues — unless `CONTEXT_HOOKS_STRICT=1` |

## Environment

The build step holds the AI provider keys (`ANTHROPIC_API_KEY`, `XAI_API_KEY`, the Claude OAuth tokens), so a hook does not inherit the build's environment. It sees only:

- `PATH`, `HOME`, `USER`, `LOGNAME`, `SHELL`, `TERM`, `TZ`, `LANG`, `LANGUAGE`, `TMPDIR`, `TEMP`, `TMP`, `VIRTUAL_ENV`, `CI` and the dynamic-loader paths (`LD_LIBRARY_PATH`, `DYLD_LIBRARY_PATH`, `DYLD_FALLBACK_LIBRARY_PATH`), enough to find and run an interpreter;
- every `LC_*`, `PYTHON*` and `CONTEXT_*` variable whose name does not look like a credential (`KEY`, `TOKEN`, `SECRET`, `PASSWORD`, `PASSWD`, `CREDENTIAL`);
- each variable named in `CONTEXT_HOOK_ENV`, comma- or space-separated, for example `CONTEXT_HOOK_ENV=GITHUB_STEP_SUMMARY`. Name a secret there only for a hook you trust with it.

Whatever a hook prints is run through the secret screen, so a credential it echoes reaches the log as `[REDACTED:<kind>]`.

## Stages

`pre_build` → *(sync, extract)* → `post_extract` → *(cards)* → `post_synthesize` → *(apex, README span, site index)* → `post_assemble` → *(query index)* → `post_index` → `post_build`

## Shipped hooks

- `post_index/50-freshness-report.py` — renders `context/index/freshness.md`
from the manifest so humans (and agents) can see at a glance when each layer was last regenerated.
- `post_build/90-schema-lint.sh` — runs the SCHEMA.md pyramid drift gate over the repo after every build.

Skipping hooks: `python3 -m scripts.context_engine build --no-hooks`.
