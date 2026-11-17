---
author: bamr87
categories:
- wargames
- vortex
date: '2026-04-07T01:41:09.000Z'
description: Vortex Level 21 — a harder reverse-engineering task that may require
  understanding an encryptor.
draft: false
excerpt: Vortex Level 21 — a harder reverse-engineering task that may require understanding
  an encryptor.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- vortex
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 21
permalink: /docs/wargames/vortex/vortex21/
sidebar_label: Level 21
source_file: sites/wargames/overthewire/vortex/vortex21.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/vortex/vortex21.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Vortex Level 21
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

Reverse Me
----------
This level is a slightly more difficult reverse me (which might require understanding the encryptor for it).

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `vortex21`, obtain access to `vortex22`.
</div>

### What this level teaches

Reverse engineering a program whose logic depends on an encryption routine.

### Key ideas

- **Understand the encryptor.** The page warns you may need to understand how it works.
- **Divide the program.** Separate the input handling, the transformation and the comparison.
- **Invert.** Once you know the transformation, work backwards from the target.

### How to approach it

1. Locate the encryption routine and describe it in pseudocode.
2. Write an equivalent function and test it against the binary's output.
3. Invert it to obtain the required input.

### Why it matters

Understanding custom crypto from binaries is a staple of malware analysis.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../vortex20/">Level 20</a><a class="sg-index" href="../">Vortex overview</a><a class="sg-next" href="../vortex22/">Level 22</a></nav>

</section>

<!-- study-guide:end -->
