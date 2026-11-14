---
author: bamr87
categories:
- wargames
- formulaone
date: '2026-04-07T01:41:09.000Z'
description: FormulaOne Level 1 — an intentionally undocumented early level, with
  a method for investigating it.
draft: false
excerpt: FormulaOne Level 1 — an intentionally undocumented early level, with a method
  for investigating it.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- formulaone
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 1
permalink: /docs/wargames/formulaone/formulaone1/
sidebar_label: Level 1
source_file: sites/wargames/overthewire/formulaone/formulaone1.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/formulaone/formulaone1.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: FormulaOne Level 1
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

There is no information for this level, intentionally.

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** the account for this page is `formulaone1`; the index tells you levels are accounts named `formulaone0`, `formulaone1` and so on.
</div>

### What to expect

Upstream states "There is no information for this level, intentionally." That is part of the game: you discover what the level does by investigating it. FormulaOne is another wargame rescued from intruded.net. Its index gives very little away beyond where to connect.

### Where it fits

FormulaOne is not given a difficulty rating in its index, and lives under `/formulaone/` on the game server (SSH port 2232). This is page 2 of 7 in this mirror. Early levels in wargames like this often hinge on a single idea. State your hypothesis in one sentence before you write any exploit.

### How to approach it

1. Run `ltrace` and `strace` to see the library and system calls it makes; they often reveal what it compares, opens or executes.
2. Note the architecture and which protections are active (`file`, `readelf -l`), so you know which techniques are possible.
3. The index says the source code for the first level can be read by logging in to a different wargame hosted on the same server, and that figuring out which one is your first task.
4. Write down the one thing the program assumes about its input, then test what happens when that assumption is false.

### Why it matters

Each level is a miniature version of a real bug class. Working it out yourself without hints builds the investigative habits that no walkthrough can give you.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../formulaone0/">Level 0</a><a class="sg-index" href="../">FormulaOne overview</a><a class="sg-next" href="../formulaone2/">Level 2</a></nav>

</section>

<!-- study-guide:end -->
