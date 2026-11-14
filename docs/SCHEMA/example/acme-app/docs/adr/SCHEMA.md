---
coverage: strict
schema: '0.1'
source_file: example/acme-app/docs/adr/SCHEMA.md
source_repo: bamr87/SCHEMA
source_url: https://github.com/bamr87/SCHEMA/blob/main/example/acme-app/docs/adr/SCHEMA.md
title: SCHEMA — docs/adr
---

# SCHEMA — docs/adr

> Architecture decision records, numbered and immutable once accepted.

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `[0-9][0-9][0-9][0-9]-*.md` | pattern | One ADR: `NNNN-kebab-title.md`, numbered sequentially | required |

## Forbidden

- Never renumber or rewrite an accepted ADR; supersede it with a new one.
