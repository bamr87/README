---
coverage: listed
schema: '0.1'
source_file: sites/zer0-pages/pages/_posts/SCHEMA.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/_posts/SCHEMA.md
title: SCHEMA — _posts
---

# SCHEMA — _posts

> Posts collection — dated articles; every category lives in its own subdirectory, with a demo/showcase index post at the root.

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `business/` | dir | Business and operations posts | |
| `development/` | dir | Software development posts | |
| `science/` | dir | Science posts | |
| `technology/` | dir | Technology and AI posts | |
| `tutorial/` | dir | Hands-on tutorial posts | |
| `world/` | dir | World and society posts | |
| `2000-01-01-index.md` | file | News-network showcase index page (epoch-dated so it never tops recent-post lists) | |
| `2???-??-??-*.md` | pattern | Uncategorized dated posts (YYYY-MM-DD-slug.md) | |

## Placement

- New post → `<category>/YYYY-MM-DD-slug.md` in the matching category directory.
- New category → a directory with `2000-01-01-index.md` + `SCHEMA.md`, plus a section in `_data/navigation/posts.yml`.
