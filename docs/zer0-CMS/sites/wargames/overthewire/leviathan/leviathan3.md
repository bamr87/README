---
author: bamr87
categories:
- wargames
- leviathan
date: '2026-04-07T01:41:09.000Z'
description: Leviathan Level 3 — another password-checking program; apply what you
  learned about tracing and compare with the earlier level.
draft: false
excerpt: Leviathan Level 3 — another password-checking program; apply what you learned
  about tracing and compare with the earlier level.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- leviathan
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 3
permalink: /docs/wargames/leviathan/leviathan3/
sidebar_label: Level 3
source_file: sites/wargames/overthewire/leviathan/leviathan3.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/leviathan/leviathan3.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Leviathan Level 3
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

There is no information for this level, intentionally.

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `leviathan3`, find the password for `leviathan4`.
</div>

### What this level teaches

Recognising a familiar pattern in a slightly different disguise, and confirming your method works again.

### Key ideas

- **Reuse your toolkit.** A tool that worked on one program often works on the next.
- **Look at differences.** If tracing gives a different result this time, compare the call sequence with the earlier level to see what changed.
- **Don't over-engineer.** Start with the simplest tool before reaching for a disassembler.

### How to approach it

1. Run the program, then run it under `ltrace`.
2. Read each call and ask what it compares and what it reveals.

### Why it matters

Experienced analysts pattern-match constantly. Having a short checklist (run, trace, strings, then disassemble) saves hours.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../leviathan2/">Level 2</a><a class="sg-index" href="../">Leviathan overview</a><a class="sg-next" href="../leviathan4/">Level 4</a></nav>

</section>

<!-- study-guide:end -->
