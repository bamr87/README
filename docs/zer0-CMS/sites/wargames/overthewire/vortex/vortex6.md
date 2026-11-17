---
author: bamr87
categories:
- wargames
- vortex
date: '2026-04-07T01:41:09.000Z'
description: Vortex Level 6 — generic binary exploitation where you must disassemble
  the program to find the hole.
draft: false
excerpt: Vortex Level 6 — generic binary exploitation where you must disassemble the
  program to find the hole.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- vortex
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 6
permalink: /docs/wargames/vortex/vortex6/
sidebar_label: Level 6
source_file: sites/wargames/overthewire/vortex/vortex6.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/vortex/vortex6.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Vortex Level 6
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

Generic Binary Exploitation
---------------------------
You must disassemble this level's exploitable application in order to find the hole.

Reading Material
----------------
- [Reconstructing Binaries to C For Beginners][]
- [Reverse Engineering - Functions... functions! functions!? sheesh][]

[Reconstructing Binaries to C For Beginners]: http://www.exploit-db.com/papers/13216/
[Reverse Engineering - Functions... functions! functions!? sheesh]: http://www.exploit-db.com/papers/13215/

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `vortex6`, obtain access to `vortex7`.
</div>

### What this level teaches

Reverse engineering a program to discover a vulnerability without any description.

### Key ideas

- **No hints on purpose.** The page says only that you must disassemble the exploitable application.
- **Reading assembly.** Identify function boundaries, arguments and local buffers, and rebuild what the C source would have looked like.
- **Reading.** The page links two papers on reconstructing binaries to C for beginners and on reading functions in disassembly.

### How to approach it

1. Run the program normally, then disassemble with `objdump -d` or a GUI tool.
2. Annotate each function with what it does, searching for unsafe copies and unchecked lengths.
3. Test your suspicion with oversized input, then build the exploit.

### Why it matters

This is the real-world situation: no source, only a binary.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../vortex5/">Level 5</a><a class="sg-index" href="../">Vortex overview</a><a class="sg-next" href="../vortex7/">Level 7</a></nav>

</section>

<!-- study-guide:end -->
