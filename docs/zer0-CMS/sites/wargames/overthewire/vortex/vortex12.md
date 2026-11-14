---
author: bamr87
categories:
- wargames
- vortex
date: '2026-04-07T01:41:09.000Z'
description: Vortex Level 12 — exploit a program knowing the stack is not executable,
  which rules out classic shellcode on the stack.
draft: false
excerpt: Vortex Level 12 — exploit a program knowing the stack is not executable,
  which rules out classic shellcode on the stack.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- vortex
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 12
permalink: /docs/wargames/vortex/vortex12/
sidebar_label: Level 12
source_file: sites/wargames/overthewire/vortex/vortex12.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/vortex/vortex12.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Vortex Level 12
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

We don't want no executable stack
---------------------------------
Exploit this level knowing that the stack is not executable. You must login to [vortex.labs.overthewire.org][] to complete this level..

[vortex.labs.overthewire.org]: ssh://vortex.labs.overthewire.org:2228

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `vortex12`, obtain access to `vortex13`.
</div>

### What this level teaches

Defeating the non-executable stack.

### Key ideas

- **NX stack.** The CPU refuses to run code placed on the stack, so injected shellcode will not work.
- **Alternatives.** Reuse existing code (return-to-libc) or chain short code fragments (return-oriented programming).
- **Library locations.** Use `ldd` and `gdb` to find functions and strings in loaded libraries.
- **Login required.** The page says you must log in to the Vortex host to complete this level.

### How to approach it

1. Confirm the stack is non-executable and read the vulnerable code.
2. Pick a function in the C library that does what you need, and find the address of a string for its argument.
3. Lay out the stack frame as the function expects.

### Why it matters

Non-executable memory is standard today, so ret2libc and ROP are the baseline techniques.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../vortex11/">Level 11</a><a class="sg-index" href="../">Vortex overview</a><a class="sg-next" href="../vortex13/">Level 13</a></nav>

</section>

<!-- study-guide:end -->
