---
coverage: listed
schema: '0.1'
source_file: sites/zer0-pages/pages/wiki/entities/SCHEMA.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/wiki/entities/SCHEMA.md
title: SCHEMA — entities
---

# SCHEMA — entities

> Entity pages — organizations, tools, projects, and standards the wiki tracks (type: entity).

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `_index.md` | file | Section index listing the entities pages | |
| `*.md` | pattern | One entity per page (kebab-case slug, e.g. zer0-mistakes, claude-obsidian, sec-edgar) | |

## Placement

- New entity page → a kebab-case `.md` here from `pages/_templates/entity.md`; register it in `../index.md`.
