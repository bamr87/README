---
description: A Portrait of the Artist as a Young Man.
hide_intro: true
layout: default
local_graph: false
permalink: /series/apota/
sidebar:
  nav: series
  title: Browse the series
source_file: apota.md
title: Apota
---
{% include page-header.html %}

*A Portrait of the Artist as a Young Man* — the earlier novel, and the Stephen Dedalus who walks back into *Ulysses* a few years later with the departure undone.

{% assign entries = site.series | where: "series", "apota" | sort: "order" %}
{% include series-list.html entries=entries empty="Nothing filed here yet." %}

{% include subscribe-band.html %}
