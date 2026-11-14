---
aliases:
- /docs/obsidian/graph/
backlinks: false
categories:
- Documentation
- Obsidian
description: Interactive force-directed map of every wiki-link between the vault's
  docs, posts, and notes.
lastmod: '2026-07-05T12:00:00Z'
layout: default
permalink: /docs/obsidian/graph/
render_with_liquid: true
sitemap: false
source_file: sites/zer0-pages/pages/_docs/obsidian/graph.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/_docs/obsidian/graph.md
tags:
- obsidian
- graph
- navigation
title: Graph View
type: doc
---

# Graph View

A live, force-directed map of this vault — every doc, post, note, and page becomes a node, and every `[[wiki-link]]` between them becomes an edge. It is the rendered-site equivalent of Obsidian's graph view, built at Jekyll build time by the bridge's wikilink parser (the same one described in the
[[zer0-CMS/sites/zer0-pages/pages/_docs/obsidian/syntax-reference|syntax reference]]) and drawn client-side
with cytoscape. Dangling links appear as dashed red nodes: fix the link, not the graph.

{% include obsidian/full-graph.html %}
