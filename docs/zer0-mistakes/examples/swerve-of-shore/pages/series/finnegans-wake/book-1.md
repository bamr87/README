---
description: Notes on Finnegans Wake, Book 1.
hide_intro: true
layout: default
local_graph: false
permalink: /series/finnegans-wake/book-1/
sidebar:
  nav: series
  title: Browse the series
source_file: book-1.md
title: Book 1
---
{% include page-header.html %}

*Finnegans Wake*, Book 1 — starting on page 3 and going slowly. Read aloud where you can.

{% assign entries = site.series | where: "series", "finnegans-wake" | where: "section", "book-1" | sort: "order" %}
{% include series-list.html entries=entries empty="Nothing filed here yet." %}

{% include subscribe-band.html %}
