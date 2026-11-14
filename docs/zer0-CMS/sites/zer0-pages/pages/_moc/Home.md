---
source_file: sites/zer0-pages/pages/_moc/Home.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/_moc/Home.md
title: Home
type: page
---

# Welcome Home

This is the front door to the vault — a living map of everything inside. Start wherever you're curious and follow the links. Each collection has its own map of content (MOC) that gathers its notes, and the quick-reference pages below help you slice the whole vault by tag, category, or date.

## Collections

- [[zer0-CMS/sites/zer0-pages/pages/_moc/Docs|Docs]] — reference material, guides, and how-tos.
- [[zer0-CMS/sites/zer0-pages/pages/posts|Posts]] — articles, essays, and dispatches.
- [[zer0-CMS/sites/zer0-pages/pages/notes|Notes]] — shorter thoughts and working notes.

## Find Your Way

- [[zer0-CMS/sites/wargames/tags|Tags]] — browse everything by topic.
- [[zer0-CMS/sites/zer0-pages/pages/categories|Categories]] — browse by category.
- [[zer0-CMS/sites/zer0-pages/pages/archives|Archives]] — everything, ordered by date.

## Fresh Off the Press

The eight most recent posts:

```dataview
TABLE date AS Date, description AS Summary
FROM "_posts"
WHERE type = "post" AND draft != true
SORT date DESC
LIMIT 8
```
