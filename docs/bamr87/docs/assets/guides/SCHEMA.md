---
coverage: listed
schema: '0.1'
source_file: docs/assets/guides/SCHEMA.md
source_repo: bamr87/bamr87
source_url: https://github.com/bamr87/bamr87/blob/main/docs/assets/guides/SCHEMA.md
title: SCHEMA — docs/assets/guides
---

# SCHEMA — docs/assets/guides

> One directory per hub guide that carries visual evidence; files are referenced from the guide Markdown (constitution section 24).

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `*/` | pattern | One directory per guide slug (mirrors the guide path under docs/ or tools/) | |
| `*/*.png` | pattern | Screenshots for a guide | |
| `*/*.svg` | pattern | Diagrams for a guide | |
| `*/*.jpg` | pattern | Screenshots for a guide | |
| `*/*.webp` | pattern | Screenshots for a guide | |
| `*/README.md` | pattern | Optional caption index for a guide's evidence set | |

## Placement

- Name the directory after the guide path slug (e.g. `CONSOLE-PAGES`, `tools-console-web`).
- Prefer PNG for UI screenshots; keep files small and redacted.
