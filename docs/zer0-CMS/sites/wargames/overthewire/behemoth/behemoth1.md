---
author: bamr87
categories:
- wargames
- behemoth
date: '2026-04-07T01:41:08.000Z'
description: Behemoth Level 1 — a classic stack buffer overflow in a binary without
  source, where you inject shellcode and redirect execution to it.
draft: false
excerpt: Behemoth Level 1 — a classic stack buffer overflow in a binary without source,
  where you inject shellcode and redirect execution to it.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- behemoth
lastmod: '2026-04-07T01:41:08.000Z'
license: MIT
nav_order: 1
permalink: /docs/wargames/behemoth/behemoth1/
sidebar_label: Level 1
source_file: sites/wargames/overthewire/behemoth/behemoth1.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/behemoth/behemoth1.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Behemoth Level 1
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

There is no information for this level, intentionally.

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `behemoth1`, find the password for `behemoth2`.
</div>

### What this level teaches

The Narnia-style stack overflow, but starting from a binary alone.

### Key ideas

- **Unsafe input functions.** Functions that read without a length limit, such as `gets`, make overflows trivial. Disassembly or `ltrace` will show which one is used.
- **Finding the offset.** Send a cyclic pattern in `gdb` and read which part lands in the saved return address.
- **Shellcode and its address.** Place shellcode in the buffer or environment, and aim the return address at it. Remember `gdb` changes the stack slightly compared with a normal run.
- **Keep the shell alive.** Make sure your input does not close standard input before the shell can use it.

### How to approach it

1. Confirm the crash with a long input.
2. Find the offset and the buffer's address.
3. Build and test the payload, adjusting for the real stack layout.

### Why it matters

It consolidates the Narnia skills and confirms you can work without source.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../behemoth0/">Level 0</a><a class="sg-index" href="../">Behemoth overview</a><a class="sg-next" href="../behemoth2/">Level 2</a></nav>

</section>

<!-- study-guide:end -->
