---
aliases:
- /notes/
description: Quick reference notes, cheatsheets, and command snippets for developers
lastmod: 2026-04-18 19:30:21+00:00
layout: default
permalink: /notes/
source_file: sites/zer0-pages/pages/notes.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/notes.md
title: Notes
type: page
---

# Notes

Quick reference notes, cheatsheets, and command snippets for developers.

## All notes

```dataview
TABLE description AS Summary, difficulty AS Difficulty, date AS Date
FROM "_notes"
WHERE type = "note" AND draft != true
SORT date DESC
```

## Browse by tag

```dataview
TABLE rows.file.link AS Notes
FROM "_notes"
WHERE type = "note" AND draft != true
FLATTEN tags AS tag
GROUP BY tag
SORT tag ASC
```
