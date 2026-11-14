---
coverage: strict
schema: '0.1'
source_file: example/acme-app/src/components/SCHEMA.md
source_repo: bamr87/SCHEMA
source_url: https://github.com/bamr87/SCHEMA/blob/main/example/acme-app/src/components/SCHEMA.md
title: SCHEMA — src/components
---

# SCHEMA — src/components

> React components: one component per file, presentation only.

## Conventions

- PascalCase filenames (`Button.tsx`) — overrides the repo-wide kebab-case rule.

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `*.tsx` | pattern | A single React component, default-exported | required |

## Forbidden

- No utility modules, styles, tests, or `.ts` files in this directory.
