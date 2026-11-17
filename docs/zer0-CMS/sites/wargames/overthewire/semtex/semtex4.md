---
author: bamr87
categories:
- wargames
- semtex
date: '2026-04-07T01:41:09.000Z'
description: Semtex Level 4 — make a stripped, statically linked program print the
  next level's password, using ptrace.
draft: false
excerpt: Semtex Level 4 — make a stripped, statically linked program print the next
  level's password, using ptrace.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- semtex
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 4
permalink: /docs/wargames/semtex/semtex4/
sidebar_label: Level 4
source_file: sites/wargames/overthewire/semtex/semtex4.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/semtex/semtex4.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Semtex Level 4
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

Ptrace your way
---------------

Pass prints the password for the level you are on. Try to make it print the next level's password. This time it is not so easy:

    /semtex/semtex4: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), statically linked, for GNU/Linux 2.6.15, stripped

Tip :
-   Pass uses geteuid() to get its information.
-   Read man ptrace

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** the `pass` program prints your own level's password; you must make it print the next one.
</div>

### What this level teaches

Using `ptrace`, the system call behind debuggers, to alter another process.

### Key ideas

- **Stripped, static binary.** The page shows the file is 32-bit, statically linked and stripped, so there are no symbols and no dynamic library calls to intercept.
- **`geteuid()`.** The program decides what to print from the effective user ID.
- **`ptrace`.** A tracing parent can read and change a child's registers and memory, so you can alter the value the child sees.
- **Reading.** `man ptrace`, as the page advises.

### How to approach it

1. Find where the program calls `geteuid` (by tracing system calls).
2. Write a launcher that traces the program and changes the result.
3. Run it and read the output.

### Why it matters

This is how debuggers, sandboxes and many anti-debugging tricks work.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../semtex3/">Level 3</a><a class="sg-index" href="../">Semtex overview</a><a class="sg-next" href="../semtex5/">Level 5</a></nav>

</section>

<!-- study-guide:end -->
