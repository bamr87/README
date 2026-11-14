---
author: bamr87
categories:
- wargames
- manpage
date: '2026-04-07T01:41:09.000Z'
description: Manpage Level 6 — an intentionally undocumented later level, with a method
  for investigating it.
draft: false
excerpt: Manpage Level 6 — an intentionally undocumented later level, with a method
  for investigating it.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- manpage
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 6
permalink: /docs/wargames/manpage/manpage6/
sidebar_label: Level 6
source_file: sites/wargames/overthewire/manpage/manpage6.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/manpage/manpage6.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Manpage Level 6
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

There is no information for this level, intentionally.

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `manpage6`, find the password for `manpage7`.
</div>

### What to expect

Upstream states "There is no information for this level, intentionally." That is part of the game: you discover what the level does by investigating it. Manpage is about breaking common Linux C-programming misconceptions. Its author's advice is that a good way to begin auditing code is to read the manual pages for pitfalls and unusual behaviour.

### Where it fits

Manpage is given only as x/10 in its original description, so effectively unrated, and lives under `/manpage/` on the game server (SSH port 2224). This is page 7 of 8 in this mirror. Later levels tend to combine ideas from earlier ones, so reread your notes on previous levels for tools you can reuse.

### How to approach it

1. Open the program in `gdb`, break at `main`, and step through to see exactly how your input is used.
2. Run `ltrace` and `strace` to see the library and system calls it makes; they often reveal what it compares, opens or executes.
3. For every library function the program calls, read its man page, especially the sections on return values, NOTES, BUGS and CAVEATS, and ask what the programmer assumed that the manual does not guarantee.
4. Write down the one thing the program assumes about its input, then test what happens when that assumption is false.

### Why it matters

Each level is a miniature version of a real bug class. Working it out yourself without hints builds the investigative habits that no walkthrough can give you.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../manpage5/">Level 5</a><a class="sg-index" href="../">Manpage overview</a><a class="sg-next" href="../manpage7/">Level 7</a></nav>

</section>

<!-- study-guide:end -->
