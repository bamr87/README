---
author: bamr87
categories:
- wargames
- vortex
date: '2026-04-07T01:41:09.000Z'
description: Vortex Level 10 — recover the seed that produced 20 random-looking integers
  within a 30-second time limit.
draft: false
excerpt: Vortex Level 10 — recover the seed that produced 20 random-looking integers
  within a 30-second time limit.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- vortex
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 10
permalink: /docs/wargames/vortex/vortex10/
sidebar_label: Level 10
source_file: sites/wargames/overthewire/vortex/vortex10.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/vortex/vortex10.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Vortex Level 10
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

Random?
-------
Read in 20 integers and write the seed used to generate those numbers in unsigned little endian format. You have a time limit of 30 seconds to do this. You must login to [vortex.labs.overthewire.org][]

[vortex.labs.overthewire.org]: ssh://vortex.labs.overthewire.org:2228

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `vortex10`, obtain access to `vortex11`.
</div>

### What this level teaches

Why pseudo-random number generators are predictable if you know how they work.

### Key ideas

- **PRNG state.** A generator's output is entirely determined by its seed and algorithm.
- **The task.** Read 20 integers and write back the seed that generated them, in unsigned little-endian format, within 30 seconds.
- **Search or invert.** Either search the seed space efficiently or invert the generator's algorithm.
- **Time pressure.** A script is essential; manual work will not meet the limit.

### How to approach it

1. Identify the generator and how it was seeded from the level's behaviour.
2. Write a program that reproduces its output for a candidate seed.
3. Automate the exchange end to end and test timing.

### Why it matters

Predictable seeds have broken real systems, from session tokens to game servers and cryptographic keys.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../vortex9/">Level 9</a><a class="sg-index" href="../">Vortex overview</a><a class="sg-next" href="../vortex11/">Level 11</a></nav>

</section>

<!-- study-guide:end -->
