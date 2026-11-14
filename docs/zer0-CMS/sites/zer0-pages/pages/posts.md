---
aliases:
- /posts/
description: Browse all articles and blog posts from the Zer0-Mistakes community
keywords:
  primary:
  - blog posts
  - articles
  - tutorials
  secondary:
  - jekyll
  - development
  - web
layout: index
permalink: /posts/
source_file: sites/zer0-pages/pages/posts.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/posts.md
title: All Posts
type: page
---

# All Posts

Browse all articles and blog posts from the Zer0-Mistakes community. The list below is generated automatically from the `_posts` collection, newest first, with drafts hidden.

```dataview
TABLE date AS Date, description AS Summary
FROM "_posts"
WHERE type = "post" AND draft != true
SORT date DESC
```
