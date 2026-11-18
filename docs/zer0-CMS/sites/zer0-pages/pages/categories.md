---
aliases:
- /categories/
description: Browse all categories and discover content by topic
lastmod: 2026-04-18 19:30:22+00:00
layout: default
permalink: /categories/
source_file: sites/zer0-pages/pages/categories.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/categories.md
title: Categories
type: page
---

# Browse by Category

Explore content organized by category. Each category below lists the related posts. Click any note to open it.

## All Categories

```dataview
TABLE rows.file.link AS Notes, length(rows) AS Count
FROM "_posts"
FLATTEN categories AS category
GROUP BY category
SORT category ASC
```

---

[[zer0-CMS/sites/zer0-pages/pages/archives|Browse the Archive]]
