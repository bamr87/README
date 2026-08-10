---
description: Where the Wake reading starts, and which edition it works from.
hide_intro: true
layout: default
local_graph: false
permalink: /series/finnegans-wake/00-introduction/
sidebar:
  nav: series
  title: Browse the series
source_file: 00-introduction.md
title: 00 Introduction
---
{% include page-header.html %}

Opening notes on *Finnegans Wake*, before Book 1. The reading works from the 1999 Penguin Classics edition, with John Bishop's introduction.

{% assign entries = site.series | where: "series", "finnegans-wake" | where: "section", "00-introduction" | sort: "order" %}
{% include series-list.html entries=entries empty="Nothing filed here yet." %}

{% include subscribe-band.html %}
