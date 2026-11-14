---
author: bamr87
categories:
- wargames
- narnia
date: '2026-04-07T01:41:09.000Z'
description: Narnia Level 7 — a format-string bug again, this time used to redirect
  a function pointer.
draft: false
excerpt: Narnia Level 7 — a format-string bug again, this time used to redirect a
  function pointer.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- narnia
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 7
permalink: /docs/wargames/narnia/narnia7/
sidebar_label: Level 7
source_file: sites/wargames/overthewire/narnia/narnia7.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/narnia/narnia7.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Narnia Level 7
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

There is no information for this level, intentionally.

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `narnia7`, find the password for `narnia8`.
</div>

### What this level teaches

Combining the format-string write primitive with a function pointer to change control flow.

### Key ideas

- **Function pointers** store the address of code to call. Changing one changes what runs.
- **Writing a precise value.** With `%n` and careful padding, you can write multi-byte values, sometimes in smaller pieces.
- **Reading the layout.** The addresses of the intended and unintended functions are printed or discoverable in the program.
- **Same technique, new goal.** You have already seen this idea in Level 5; here the target is different.

### How to approach it

1. Read the source and note how the pointer is set and used.
2. Find the addresses involved and the stack position of your input.
3. Build the format string, test with harmless values, then use the real ones.

### Why it matters

Writing a pointer is the usual first step to controlling a program, even in modern, hardened software.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../narnia6/">Level 6</a><a class="sg-index" href="../">Narnia overview</a><a class="sg-next" href="../narnia8/">Level 8</a></nav>

</section>

<!-- study-guide:end -->
