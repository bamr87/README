---
aliases:
- /
description: Landing page for the zer0-pages vault — the Obsidian-authored knowledge
  base and Jekyll source behind the zer0-mistakes theme.
layout: home
permalink: /
source_file: sites/zer0-pages/pages/index.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/index.md
title: Home
type: page
---

This is the landing page for the vault. Start at the hub: [[zer0-CMS/sites/zer0-pages/pages/_moc/Home|Home MOC]].

## Recent Posts

```dataview
TABLE date AS Date, description AS Summary
FROM "_posts"
WHERE type = "post" AND draft != true
SORT date DESC
```
