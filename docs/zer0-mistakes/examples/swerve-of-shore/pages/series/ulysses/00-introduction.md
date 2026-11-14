---
description: Where the reading starts, and which edition it works from.
hide_intro: true
layout: default
local_graph: false
permalink: /series/ulysses/00-introduction/
sidebar:
  nav: series
  title: Browse the series
source_file: examples/swerve-of-shore/pages/series/ulysses/00-introduction.md
source_repo: bamr87/zer0-mistakes
source_url: https://github.com/bamr87/zer0-mistakes/blob/main/examples/swerve-of-shore/pages/series/ulysses/00-introduction.md
title: Ulysses — Introduction
---

{% include page-header.html %}

Opening notes, before the first episode. The reading works from the 1922 first printing by Shakespeare & Co.

{% assign entries = site.series | where: "series", "ulysses" | where: "section", "00-introduction" | sort: "order" %}
{% include series-list.html entries=entries empty="Nothing filed here yet." %}

{% include subscribe-band.html %}
