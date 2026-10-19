---
author: Barodybroject Team <team@example.com>
breaking: false
date: '2026-10-11'
impact: medium
related_issues:
- '#110'
related_prs: []
reviewers: []
source_file: 2026-10-11-model-sync-filter-and-retirement.md
title: 'Improvement: a live model sync is filtered, curated, and retires stale models'
type: improvement
version: 0.6.0
---
# Improvement: a live model sync is filtered, curated, and retires stale models

> **Summary**: `sync_models()` now tells a live catalogue apart from the
> static fallback. With OpenAI configured it offers only chat-completion
> models, keeps the curated names of models it already knows, and marks
> models a live catalogue no longer lists `is_active=False`. A failed
> discovery changes nothing.

## Problem

#183 made the model picker dynamic (`sync_models` → `AIModel` → `GET /api/ai-models/?active=true`), but with OpenAI configured:

- `OpenAIProvider.list_models()` turned **every** id from `/v1/models` into a selectable model — image (`dall-e-3`, `gpt-image-1`), speech (`tts-1`), transcription (`whisper-1`), embedding, legacy completion (`babbage-002`) and `*-instruct` / `*-realtime` models — although the provider only calls chat completions.
- `sync_models()` only ever wrote `is_active=True`, so a model the vendor delisted stayed selectable forever.
- Discovered rows got `display_name = id` and no description, even for `gpt-4o`, which `STATIC_MODELS` already describes.
- Retiring naively was unsafe: `list_models()` silently fell back to the static list on any error, so "deactivate everything not listed" would have retired every discovered model whenever the API hiccupped.

## Change

| File | Change |
|---|---|
| `src/parodynews/ai/base.py` | New `discover_models()` (live list, `None` when there is nothing to ask, **raises** on failure) and `catalogue()` → `(models, live)`. `list_models()` is now `catalogue()[0]`. |
| `src/parodynews/ai/providers/openai.py` | `CHAT_MODEL_PREFIXES` / `EXCLUDED_MODEL_MARKERS` + `is_chat_model()`; `discover_models()` filters by them and reuses `STATIC_MODELS` metadata. |
| `src/parodynews/ai/providers/anthropic.py` | Implements `discover_models()` instead of its own best-effort `list_models()`. Behaviour unchanged. |
| `src/parodynews/services/assistants.py` | After a **live** catalogue, active rows of this provider not in it — except the provider's default model — are set `is_active=False` (never deleted; `Assistant.model` is `SET_NULL`). `SyncReport.deactivated` lists them. |
| `management/commands/sync_models.py`, `src/frontend/src/pages/Settings.tsx`, `src/frontend/src/api/types.ts` | Report the deactivated count. |
| `src/parodynews/model_choices.json` | Deleted: an orphaned 2025 snapshot nothing referenced. |
| `src/parodynews/management/README.md`, `commands/README.md`, `services/README.md`, `ai/README.md` | Documentation of the filter and retire-on-sync behaviour; the removed `fetch_models` command is no longer documented. |

No migration: `AIModel.is_active` already exists.

## Testing

- `test_ai_layer.py::test_openai_discovery_offers_only_chat_models` — an 11-id fake account catalogue yields exactly `{gpt-4o, gpt-4o-mini, o3-mini}`, and `gpt-4o` carries its curated name and description.
- `test_services_models.py` — a live sync retires `gpt-4-legacy` without touching the assistant that uses it and hides it from `?active=true`; a failed discovery changes no `is_active` flag; the default model is never retired; other providers' rows are untouched.

Every test injects a fake OpenAI client: none needs `OPENAI_API_KEY` or opens a network connection.

## Breaking changes

None. `list_models()` keeps its signature and its best-effort fallback; `SyncReport.as_dict()` gains a `deactivated` key.

## Related

- Issue [#110](https://github.com/bamr87/barodybroject/issues/110)
- [`src/parodynews/ai/README.md`](../../../src/parodynews/ai/README.md) — "Model catalogue"
