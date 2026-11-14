---
coverage: listed
schema: '0.1'
source_file: docs/assets/SCHEMA.md
source_repo: bamr87/bamr87
source_url: https://github.com/bamr87/bamr87/blob/main/docs/assets/SCHEMA.md
title: SCHEMA — docs/assets
---

# SCHEMA — docs/assets

> Static assets referenced from hub docs — screenshots and visual evidence for tutorials and setup guides (constitution section 24).

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `guides/` | dir | Per-guide screenshot and visual-evidence store (docs/VISUAL-EVIDENCE.md) | |
| `*.png` | pattern | Optional top-level doc images | |
| `*.svg` | pattern | Optional top-level doc diagrams | |
| `*.jpg` | pattern | Optional top-level doc images | |
| `*.webp` | pattern | Optional top-level doc images | |

## Placement

- Guide screenshots → `guides/<guide-slug>/` (one dir per guide path slug).
- Do not commit secrets, tokens, or PII in screenshots.
