---
coverage: listed
schema: '0.1'
source_file: example/acme-app/docs/SCHEMA.md
source_repo: bamr87/SCHEMA
source_url: https://github.com/bamr87/SCHEMA/blob/main/example/acme-app/docs/SCHEMA.md
title: SCHEMA — docs
---

# SCHEMA — docs

> Human and agent documentation for acme-app.

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `adr/` | dir | Architecture decision records | required |
| `index.md` | file | Documentation landing page | required |

## Placement

- New architecture decision → `adr/`
- New guide or explainer → a kebab-case `.md` beside `index.md`, registered here.
