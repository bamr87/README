---
author: bamr87
categories:
- wargames
- natas
date: '2026-04-07T01:41:09.000Z'
description: Natas Level 23 — a password check mixes string search with a numeric
  comparison; learn how PHP's loose typing can be satisfied in surprising ways.
draft: false
excerpt: Natas Level 23 — a password check mixes string search with a numeric comparison;
  learn how PHP's loose typing can be satisfied in surprising ways.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- natas
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 23
permalink: /docs/wargames/natas/natas23/
sidebar_label: Level 23
source_file: sites/wargames/overthewire/natas/natas23.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/natas/natas23.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Natas Level 23
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

    Username: natas23
    URL:      http://natas23.natas.labs.overthewire.org

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** sign in as `natas23` and find the password for `natas24`.
</div>

### What this level teaches

How comparing text and numbers together in a dynamically typed language creates logic holes.

### Key ideas

- **Type juggling.** In older PHP, comparing a string with a number converts one into the other, often in surprising ways.
- **Two conditions at once.** The code requires a string to contain a specific word *and* to compare as a number against a threshold.
- **Satisfying both.** An input can start with digits and contain the required word.
- **Read the source.** The two checks are written explicitly.

### How to approach it

1. Read the conditions and look up how PHP converts strings to numbers.
2. Construct one input that satisfies both.

### How developers prevent it

Use strict comparison (`===`), validate types explicitly and keep password logic out of hand-written conditions.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../natas22/">Level 22</a><a class="sg-index" href="../">Natas overview</a><a class="sg-next" href="../natas24/">Level 24</a></nav>

</section>

<!-- study-guide:end -->
