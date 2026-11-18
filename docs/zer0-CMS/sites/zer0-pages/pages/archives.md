---
aliases:
- /archives/
description: Post archives by year.
lastmod: 2026-04-18 19:30:21+00:00
layout: default
permalink: /archives/
source_file: sites/zer0-pages/pages/archives.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/archives.md
title: Archives
type: page
---

# Archives

Every post in the vault, grouped by the year it was published, newest first. The list below is generated automatically by Dataview, so it stays current as new posts are added.

```dataview
TABLE rows.file.link AS Posts, rows.date AS Date
FROM "_posts"
WHERE type = "post" AND draft != true
FLATTEN dateformat(date, "yyyy") AS year
GROUP BY year
SORT year DESC
```
