---
author: bamr87
categories:
- wargames
- bandit
date: '2026-04-07T01:41:08.000Z'
description: Bandit Level 11 — decode Base64 data, learning that encoding is not encryption.
draft: false
excerpt: Bandit Level 11 — decode Base64 data, learning that encoding is not encryption.
keywords:
- security
- wargames
- linux
- overthewire
- ctf
- cybersecurity
lastmod: '2026-04-07T01:41:08.000Z'
license: MIT
nav_order: 11
permalink: /docs/wargames/bandit/bandit11/
sidebar_label: Level 11
source_file: sites/wargames/overthewire/bandit/bandit11.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/bandit/bandit11.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Bandit Level 11
toc_sticky: true
---

> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

Level Goal
----------
The password for the next level is stored in the file **data.txt**, which contains base64 encoded data

Commands you may need to solve this level
-----------------------------------------
grep, sort, uniq, strings, base64, tr, tar, gzip, bzip2, xxd

Helpful Reading Material
------------------------
- [Base64 on Wikipedia][]

[Base64 on Wikipedia]: https://en.wikipedia.org/wiki/Base64

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `bandit10`, find the password for `bandit11`.
</div>

### What this level teaches

What Base64 is, how to recognise it, and how to reverse it.

### Key ideas

- **Encoding vs encryption.** Base64 represents arbitrary bytes using 64 safe text characters so they survive email, URLs and JSON. It involves no key and provides no secrecy.
- **Recognising Base64.** Letters, digits, `+` and `/`, often with `=` padding at the end, in lines of regular length.
- **`base64 -d`** decodes; run without `-d` it encodes.

### How to approach it

1. Look at the file and note the telltale alphabet.
2. Decode it with the `base64` command; check the manual for the decode flag.
3. Try encoding a short phrase and decoding it back to see the round trip.

### Why it matters

Base64 appears in HTTP headers, tokens, certificates and email. Mistaking it for encryption is a common real-world security error.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../bandit10/">Level 10</a><a class="sg-index" href="../">Bandit overview</a><a class="sg-next" href="../bandit12/">Level 12</a></nav>

</section>

<!-- study-guide:end -->
