---
coverage: strict
schema: '0.1'
source_file: example/acme-app/src/lib/SCHEMA.md
source_repo: bamr87/SCHEMA
source_url: https://github.com/bamr87/SCHEMA/blob/main/example/acme-app/src/lib/SCHEMA.md
title: SCHEMA — src/lib
---

# SCHEMA — src/lib

> Pure utility modules shared across the app.

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `*.ts` | pattern | A single-purpose pure utility module, kebab-case | required |

## Forbidden

- No React imports; no I/O or global state.
