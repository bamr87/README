---
author: bamr87
categories:
- wargames
- drifter
date: '2026-04-07T01:41:09.000Z'
description: 'Drifter Level 7 — "Gentleman, start your disassemblers": a reverse-engineering
  level with IDA recommended.'
draft: false
excerpt: 'Drifter Level 7 — "Gentleman, start your disassemblers": a reverse-engineering
  level with IDA recommended.'
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- drifter
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 7
permalink: /docs/wargames/drifter/drifter7/
sidebar_label: Level 7
source_file: sites/wargames/overthewire/drifter/drifter7.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/drifter/drifter7.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Drifter Level 7
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

Gentleman, start your disassemblers

**Material:**

[IDA Pro Freeware][]

[IDA Pro Demo][]

  [IDA Pro Freeware]: http://www.hex-rays.com/idapro/idadownfreeware.htm
  [IDA Pro Demo]: http://www.hex-rays.com/idapro/idadowndemo.htm

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Where it fits:** Drifter level 7 of 0–15, in the remote daemons stage of the game. The page does not say which account you start as, so check with `id` after connecting.
</div>

### What this level teaches

Using a disassembler to understand a program.

### Key ideas

- **Disassembler.** The page links IDA Pro Freeware and a demo. Ghidra is a free alternative.
- **Method.** Identify entry points, strings and library calls first, then follow interesting paths.
- **Annotate.** Rename functions and variables as you understand them.

### How to approach it

1. Load the binary, list strings and imports.
2. Trace from input to decision.
3. Confirm your reading by running it with chosen inputs.

### Why it matters

Reverse-engineering fluency is the skill that unlocks the rest of the game.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../drifter6/">Level 6</a><a class="sg-index" href="../">Drifter overview</a><a class="sg-next" href="../drifter8/">Level 8</a></nav>

</section>

<!-- study-guide:end -->
