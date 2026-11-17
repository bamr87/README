---
author: bamr87
categories:
- wargames
- leviathan
date: '2026-04-07T01:41:09.000Z'
description: Leviathan Level 6 — a program wants a four-digit code; learn to brute-force
  a small secret with a shell loop.
draft: false
excerpt: Leviathan Level 6 — a program wants a four-digit code; learn to brute-force
  a small secret with a shell loop.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- leviathan
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 6
permalink: /docs/wargames/leviathan/leviathan6/
sidebar_label: Level 6
source_file: sites/wargames/overthewire/leviathan/leviathan6.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/leviathan/leviathan6.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Leviathan Level 6
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

There is no information for this level, intentionally.

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `leviathan6`, find the password for `leviathan7`.
</div>

### What this level teaches

Automating a guessing attack on a small search space.

### Key ideas

- **Search space.** A four-digit code has only 10,000 possibilities.
- **Loops.** A `for` loop with `seq` and `printf` can generate every candidate, including leading zeros.
- **Detecting success.** The program behaves differently on a wrong and a right code, so your loop can stop when the output changes.

### How to approach it

1. Run the program once by hand to learn its arguments and failure behaviour.
2. Write a loop that tries each value and prints only the interesting result.

### Why it matters

It shows why short numeric codes need rate limiting, and gives you practice with shell automation for later games.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../leviathan5/">Level 5</a><a class="sg-index" href="../">Leviathan overview</a><a class="sg-next" href="../leviathan7/">Level 7</a></nav>

</section>

<!-- study-guide:end -->
