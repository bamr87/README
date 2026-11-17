---
author: bamr87
categories:
- wargames
- semtex
date: '2026-04-07T01:41:09.000Z'
description: 'Semtex Level 11 — "Déjà vu": a modified version of an earlier encryption
  tool, with process plumbing (popen, dup2) suggested as reading.'
draft: false
excerpt: 'Semtex Level 11 — "Déjà vu": a modified version of an earlier encryption
  tool, with process plumbing (popen, dup2) suggested as reading.'
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- semtex
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 11
permalink: /docs/wargames/semtex/semtex11/
sidebar_label: Level 11
source_file: sites/wargames/overthewire/semtex/semtex11.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/semtex/semtex11.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Semtex Level 11
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

Deja vue
--------
/rdx/vl1b is vortex semtex1 with a slight modification to make things a little bit harder.

Thanks to andrewg for inspiration.

Suggested reading
-----------------
manpages: popen, dup2

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** the program is `/rdx/vl1b`, a slightly harder variant of the Vortex/Semtex 1 tool.
</div>

### What this level teaches

Applying a previous technique to a modified target, and understanding how programs connect to other processes.

### Key ideas

- **Reuse your Level 1 approach.** The page says this is the earlier tool with a modification that makes it harder.
- **popen and dup2.** The suggested manual pages describe how a program starts a child and wires up its input and output.
- **Differences.** Find exactly what has changed.

### How to approach it

1. Run both tools on the same inputs and compare.
2. Read the manual pages for the suggested system calls.
3. Adapt your earlier solution.

### Why it matters

Variants of the same idea appear constantly, and a systematic comparison is the fastest way through.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../semtex10/">Level 10</a><a class="sg-index" href="../">Semtex overview</a><a class="sg-next" href="../semtex12/">Level 12</a></nav>

</section>

<!-- study-guide:end -->
