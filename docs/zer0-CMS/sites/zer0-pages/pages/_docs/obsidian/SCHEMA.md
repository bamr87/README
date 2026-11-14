---
coverage: listed
schema: '0.1'
source_file: sites/zer0-pages/pages/_docs/obsidian/SCHEMA.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/_docs/obsidian/SCHEMA.md
title: SCHEMA — obsidian
---

# SCHEMA — obsidian

> Docs on the Obsidian vault integration and bridge plugins.

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `index.md` | file | Obsidian topic landing page | |
| `*.md` | pattern | One doc page per vault concern (authoring workflow, graph, syntax reference, performance, troubleshooting) | |

## Placement

- New obsidian doc page → a kebab-case `.md` file here, linked from `index.md` and `_data/navigation/docs.yml`.
