---
author: bamr87
categories:
- wargames
- vortex
date: '2026-04-07T01:41:09.000Z'
description: Vortex Level 2 — create a specially crafted tar file, learning the archive
  format and how tools process it.
draft: false
excerpt: Vortex Level 2 — create a specially crafted tar file, learning the archive
  format and how tools process it.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- vortex
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 2
permalink: /docs/wargames/vortex/vortex2/
sidebar_label: Level 2
source_file: sites/wargames/overthewire/vortex/vortex2.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/vortex/vortex2.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Vortex Level 2
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

Level Goal
----------
Create a special tar file

Helpful Reading Material
------------------------
[GNU tar manual][]



[GNU tar manual]: http://linux.die.net/man/1/tar

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `vortex2`, obtain access to `vortex3`.
</div>

### What this level teaches

How an archive format works and how a program that handles archives can be steered.

### Key ideas

- **tar format.** A tar archive is a sequence of header blocks and data; the page links the GNU tar manual.
- **Crafting input.** Instead of using `tar` normally, think about which fields and filenames you control.
- **Find your lever.** The page says only that a special tar file is needed, so work out which part of the program's use of tar you control: names, options or contents.

### How to approach it

1. Read the GNU tar manual sections on formats and options.
2. Look at the level's program under `/vortex/` and trace how it invokes tar.
3. Build and test small archives before the final one.

### Why it matters

Archive handling flaws (path traversal, symlinks, overwrite) are common real vulnerabilities.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../vortex1/">Level 1</a><a class="sg-index" href="../">Vortex overview</a><a class="sg-next" href="../vortex3/">Level 3</a></nav>

</section>

<!-- study-guide:end -->
