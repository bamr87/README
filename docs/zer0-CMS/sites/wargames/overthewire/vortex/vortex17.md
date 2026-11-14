---
author: bamr87
categories:
- wargames
- vortex
date: '2026-04-07T01:41:09.000Z'
description: Vortex Level 17 — work backwards from observed behaviour to understand
  the program, then exploit it.
draft: false
excerpt: Vortex Level 17 — work backwards from observed behaviour to understand the
  program, then exploit it.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- vortex
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 17
permalink: /docs/wargames/vortex/vortex17/
sidebar_label: Level 17
source_file: sites/wargames/overthewire/vortex/vortex17.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/vortex/vortex17.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Vortex Level 17
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

Working Backwards
-----------------
This level requires you to work backwards to find out what's happening then exploit it. You must login to [vortex.labs.overthewire.org][] to complete this level.

[vortex.labs.overthewire.org]: ssh://vortex.labs.overthewire.org:2228

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `vortex17`, obtain access to `vortex18`.
</div>

### What this level teaches

Reasoning from effects back to causes.

### Key ideas

- **Reverse reasoning.** Start from what the program outputs or does and deduce what inputs and internal state produced it.
- **Instrument.** Use tracing and a debugger to see intermediate values.
- **Then attack.** Once you understand the logic, the vulnerability becomes clear.

### How to approach it

1. Gather the observable behaviour in detail.
2. Build a model that explains it.
3. Look for where the model allows a mistake you can exploit.

### Why it matters

Debugging and exploit work are both inference problems.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../vortex16/">Level 16</a><a class="sg-index" href="../">Vortex overview</a><a class="sg-next" href="../vortex18/">Level 18</a></nav>

</section>

<!-- study-guide:end -->
