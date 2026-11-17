---
author: bamr87
categories:
- wargames
- behemoth
date: '2026-04-07T01:41:08.000Z'
description: Behemoth Level 3 — a format-string vulnerability in a binary without
  source, used to write to memory and take control.
draft: false
excerpt: Behemoth Level 3 — a format-string vulnerability in a binary without source,
  used to write to memory and take control.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- behemoth
lastmod: '2026-04-07T01:41:08.000Z'
license: MIT
nav_order: 3
permalink: /docs/wargames/behemoth/behemoth3/
sidebar_label: Level 3
source_file: sites/wargames/overthewire/behemoth/behemoth3.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/behemoth/behemoth3.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Behemoth Level 3
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

There is no information for this level, intentionally.

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `behemoth3`, find the password for `behemoth4`.
</div>

### What this level teaches

Format-string exploitation starting from a compiled program.

### Key ideas

- **Recognising the bug.** The program prints your input with a `printf`-style call without a fixed format. Feeding `%x` specifiers shows stack contents.
- **Locating your input** on the stack with positional specifiers.
- **Choosing a target to overwrite.** A function pointer, a Global Offset Table entry or a return address can redirect execution.
- **Where to put shellcode.** An environment variable is a convenient place, and its address can be computed.

### How to approach it

1. Confirm the vulnerability with a harmless sequence of specifiers.
2. Find the stack index of your own input.
3. Decide on the target and the value, then build the write.

### Why it matters

It repeats a technique you learned earlier in a more realistic setting.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../behemoth2/">Level 2</a><a class="sg-index" href="../">Behemoth overview</a><a class="sg-next" href="../behemoth4/">Level 4</a></nav>

</section>

<!-- study-guide:end -->
