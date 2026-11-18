---
coverage: listed
schema: '0.1'
source_file: sites/zer0-pages/pages/_notes/SCHEMA.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/_notes/SCHEMA.md
title: SCHEMA — _notes
---

# SCHEMA — _notes

> Notes collection — quick-reference cheatsheets and command snippets published under /notes/.

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `_templates/` | dir | Frontmatter template for new notes — excluded from the build | |
| `*.md` | pattern | One cheatsheet per tool or topic (kebab-case slug, `layout: note`) | |

## Placement

- New cheatsheet → `<topic>.md` here, started from `_templates/note-template.md`.
