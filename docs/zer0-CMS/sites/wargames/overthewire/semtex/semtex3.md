---
author: bamr87
categories:
- wargames
- semtex
date: '2026-04-07T01:41:09.000Z'
description: Semtex Level 3 — set a combination of numeric locks correctly, by calculation
  or by brute force.
draft: false
excerpt: Semtex Level 3 — set a combination of numeric locks correctly, by calculation
  or by brute force.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- semtex
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 3
permalink: /docs/wargames/semtex/semtex3/
sidebar_label: Level 3
source_file: sites/wargames/overthewire/semtex/semtex3.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/semtex/semtex3.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Semtex Level 3
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

Number-Lock Action
------------------
You are almost on Semtex 3, there is just one big door before you. It is locked with a number lock. **Analyze** and use the locks in /semtex/semtex3 to adjust all the numbers in the correct way. They will open your way to the next level.

Tip : **If you are not good at math, you should consider brute force. Rewrite the program and try all possible combinations of the locks. It wont take more than a few seconds ;)**

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** the "door" in `/semtex/semtex3` must be unlocked to proceed.
</div>

### What this level teaches

Combinatorial analysis, and when brute force beats cleverness.

### Key ideas

- **Analyse the locks.** Work out what each lock does to the numbers.
- **The tip.** If maths is not your strength, rewrite the program and try every combination, which the page says takes only seconds.
- **Search space.** Estimate the number of combinations before you start.

### How to approach it

1. Read the program and write down the rules.
2. Estimate how many combinations there are.
3. Decide between solving it analytically and a simple search.

### Why it matters

Knowing when exhaustive search is cheap is a core security instinct.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../semtex2/">Level 2</a><a class="sg-index" href="../">Semtex overview</a><a class="sg-next" href="../semtex4/">Level 4</a></nav>

</section>

<!-- study-guide:end -->
