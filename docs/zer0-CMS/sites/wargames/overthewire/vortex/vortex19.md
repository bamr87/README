---
author: bamr87
categories:
- wargames
- vortex
date: '2026-04-07T01:41:09.000Z'
description: Vortex Level 19 — write a key generator for a program, hindered by a
  weak form of binary encryption.
draft: false
excerpt: Vortex Level 19 — write a key generator for a program, hindered by a weak
  form of binary encryption.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- vortex
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 19
permalink: /docs/wargames/vortex/vortex19/
sidebar_label: Level 19
source_file: sites/wargames/overthewire/vortex/vortex19.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/vortex/vortex19.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Vortex Level 19
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

Key Generation
--------------
This level requires you to "keygen" the level, with a minor obstacle of a weak form of binary encryption in place.

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `vortex19`, obtain access to `vortex20`.
</div>

### What this level teaches

Reverse-engineering a licence or key check, and working around obfuscation.

### Key ideas

- **Keygen.** A program that creates valid keys by replicating the check's algorithm.
- **Binary encryption.** The program's code is partly encrypted in a weak way, so you must decode or unpack it before you can read the check.
- **Debug the unpacker.** The decryption routine itself is your way in.

### How to approach it

1. Find how and when the code is decrypted.
2. Dump the decoded version and analyse the check.
3. Reproduce the algorithm in your own program.

### Why it matters

Packers and obfuscators appear in malware and licence schemes, and unpacking is a basic skill.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../vortex18/">Level 18</a><a class="sg-index" href="../">Vortex overview</a><a class="sg-next" href="../vortex20/">Level 20</a></nav>

</section>

<!-- study-guide:end -->
