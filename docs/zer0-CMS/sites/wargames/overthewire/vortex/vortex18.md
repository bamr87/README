---
author: bamr87
categories:
- wargames
- vortex
date: '2026-04-07T01:41:09.000Z'
description: Vortex Level 18 — take advantage of how the program depends on /dev/urandom
  for its seeds.
draft: false
excerpt: Vortex Level 18 — take advantage of how the program depends on /dev/urandom
  for its seeds.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- vortex
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 18
permalink: /docs/wargames/vortex/vortex18/
sidebar_label: Level 18
source_file: sites/wargames/overthewire/vortex/vortex18.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/vortex/vortex18.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Vortex Level 18
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

urandom seeds
-------------
Take advantage of the application's urandom dependency.

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `vortex18`, obtain access to `vortex19`.
</div>

### What this level teaches

How randomness sources are used, and what happens when a program uses them badly.

### Key ideas

- **`/dev/urandom`.** A cryptographically strong source of random bytes; it is only as good as how the program uses it.
- **Dependence.** The program relies on it in a way you can influence or predict.
- **Environment control.** Think about what the program does if the random source behaves differently, is exhausted, or is read in an unexpected way.

### How to approach it

1. Trace the program's file and system calls with `strace`.
2. See exactly how many bytes it reads and what it does with them.
3. Find the assumption that fails.

### Why it matters

Seeding mistakes are a recurring cause of weak keys and tokens.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../vortex17/">Level 17</a><a class="sg-index" href="../">Vortex overview</a><a class="sg-next" href="../vortex19/">Level 19</a></nav>

</section>

<!-- study-guide:end -->
