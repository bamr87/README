---
author: bamr87
categories:
- wargames
- vortex
date: '2026-04-07T01:41:09.000Z'
description: Vortex Level 13 — a non-executable-stack level that asks "how big is
  your shellcode?", pushing you toward compact payloads.
draft: false
excerpt: Vortex Level 13 — a non-executable-stack level that asks "how big is your
  shellcode?", pushing you toward compact payloads.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- vortex
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 13
permalink: /docs/wargames/vortex/vortex13/
sidebar_label: Level 13
source_file: sites/wargames/overthewire/vortex/vortex13.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/vortex/vortex13.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Vortex Level 13
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

Inconveniences
--------------
How big is your shellcode? This level has a non-executable stack. You must login to [vortex.labs.overthewire.org][] to complete this level.

[vortex.labs.overthewire.org]: ssh://vortex.labs.overthewire.org:2228

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `vortex13`, obtain access to `vortex14`.
</div>

### What this level teaches

Working under tight space constraints.

### Key ideas

- **Size matters.** The level's title and question point to a limited amount of room for your payload.
- **Compact shellcode.** Shorter instruction sequences, reusing registers, and avoiding forbidden bytes.
- **Non-executable stack still applies,** so check whether you must reuse existing code.
- **Verify in the debugger.** Count bytes and test on the target.

### How to approach it

1. Measure the space you have and what bytes are forbidden.
2. Find the smallest sequence that achieves your goal.
3. Test the payload with the real constraints.

### Why it matters

Real exploits often have only a few bytes to work with, which is why shellcode tricks and staged payloads exist.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../vortex12/">Level 12</a><a class="sg-index" href="../">Vortex overview</a><a class="sg-next" href="../vortex14/">Level 14</a></nav>

</section>

<!-- study-guide:end -->
