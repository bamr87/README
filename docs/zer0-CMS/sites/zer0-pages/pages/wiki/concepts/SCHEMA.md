---
coverage: listed
schema: '0.1'
source_file: sites/zer0-pages/pages/wiki/concepts/SCHEMA.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/wiki/concepts/SCHEMA.md
title: SCHEMA — concepts
---

# SCHEMA — concepts

> Concept pages — one idea, methodology, or mechanism per page (type: concept).

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `_index.md` | file | Section index listing the concepts pages | |
| `*.md` | pattern | One concept per page (kebab-case slug, e.g. radical-transparency, prd-machine) | |

## Placement

- New concept page → a kebab-case `.md` here from `pages/_templates/concept.md`; register it in `../index.md`.
