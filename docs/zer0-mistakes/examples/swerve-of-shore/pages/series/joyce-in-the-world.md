---
description: Joyce read against his contemporaries and the writers behind him.
hide_intro: true
layout: default
local_graph: false
permalink: /series/joyce-in-the-world/
sidebar:
  nav: series
  title: Browse the series
source_file: joyce-in-the-world.md
title: Joyce In The World
---
{% include page-header.html %}

Essays outside the numbered sequence: Joyce set against the writers he read, the ones he was read against, and the world the books came out of.

{% assign entries = site.series | where: "series", "joyce-in-the-world" | sort: "date" | reverse %}
{% include series-list.html entries=entries empty="Nothing filed here yet." %}

{% include subscribe-band.html %}
