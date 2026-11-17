---
author: bamr87
categories:
- wargames
- utumno
date: '2026-04-07T01:41:09.000Z'
description: Utumno Level 2 — an intentionally undocumented early level, with a method
  for investigating it.
draft: false
excerpt: Utumno Level 2 — an intentionally undocumented early level, with a method
  for investigating it.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- utumno
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 2
permalink: /docs/wargames/utumno/utumno2/
sidebar_label: Level 2
source_file: sites/wargames/overthewire/utumno/utumno2.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/utumno/utumno2.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Utumno Level 2
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

There is no information for this level, intentionally.

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `utumno2`, find the password for `utumno3`.
</div>

### What to expect

Upstream states "There is no information for this level, intentionally." That is part of the game: you discover what the level does by investigating it. Utumno is a regular binary-exploitation wargame rescued from intruded.net. Its authors call it slightly harder than Behemoth and a lot harder than Leviathan.

### Where it fits

Utumno is rated 4/10 by its original authors, and lives under `/utumno/` on the game server (SSH port 2227). This is page 3 of 9 in this mirror. Early levels in wargames like this often hinge on a single idea. State your hypothesis in one sentence before you write any exploit.

### How to approach it

1. Look through the game's data directory for source code, helper files and anything readable that explains the setup.
2. Try unusual input: nothing, far too much, special characters, and unexpected arguments or environment variables.
3. If you get stuck repeatedly, finish Behemoth first; the authors explicitly recommend it.
4. Write down the one thing the program assumes about its input, then test what happens when that assumption is false.

### Why it matters

Each level is a miniature version of a real bug class. Working it out yourself without hints builds the investigative habits that no walkthrough can give you.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../utumno1/">Level 1</a><a class="sg-index" href="../">Utumno overview</a><a class="sg-next" href="../utumno3/">Level 3</a></nav>

</section>

<!-- study-guide:end -->
