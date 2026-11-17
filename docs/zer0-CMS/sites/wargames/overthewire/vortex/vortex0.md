---
author: bamr87
categories:
- wargames
- vortex
date: '2026-04-07T01:41:09.000Z'
description: Vortex Level 0 — write a small TCP client that reads four unsigned integers
  in host byte order, adds them, and sends back the result.
draft: false
excerpt: Vortex Level 0 — write a small TCP client that reads four unsigned integers
  in host byte order, adds them, and sends back the result.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- vortex
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 0
permalink: /docs/wargames/vortex/vortex0/
sidebar_label: Level 0
source_file: sites/wargames/overthewire/vortex/vortex0.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/vortex/vortex0.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Vortex Level 0
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

Level Goal
----------
Your goal is to connect to port 5842 on vortex.labs.overthewire.org and read in 4 unsigned integers in host byte order. Add these integers together and send back the results to get a username and password for vortex1. This information can be used to log in using SSH.

**Note:** vortex is on an 32bit x86 machine (meaning, a little endian architecture)

Helpful Reading Material
------------------------
- [C Programming Introduction][]
- [Network Programming Tutorial][]

  [C Programming Introduction]: http://beej.us/guide/bgc/
  [Network Programming Tutorial]: http://beej.us/guide/bgnet/

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** connect to port 5842 on `vortex.labs.overthewire.org` to obtain the credentials for the next account.
</div>

### What this level teaches

Basic network programming and the realities of 32-bit little-endian data.

### Key ideas

- **Sockets.** Create a TCP socket, connect, read and write. The page links Beej's network programming guide.
- **Byte order.** The server sends four 32-bit unsigned integers in host byte order. The page notes the machine is 32-bit x86, so little-endian.
- **Fixed-width arithmetic.** Think about what a 32-bit unsigned integer can hold and what happens when a sum is too big; the value you send must fit the same format.
- **Parsing binary data.** In Python, the `struct` module reads and writes binary integers.

### How to approach it

1. Connect with a small script and read exactly the bytes you expect.
2. Convert them to numbers, add them correctly for the width involved, and send the result in the same format.

### Why it matters

Binary protocols and integer width mistakes are the foundation of countless exploits.

<nav class="sg-nav" aria-label="Level navigation"><span></span><a class="sg-index" href="../">Vortex overview</a><a class="sg-next" href="../vortex1/">Level 1</a></nav>

</section>

<!-- study-guide:end -->
