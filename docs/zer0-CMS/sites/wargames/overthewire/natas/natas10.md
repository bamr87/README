---
author: bamr87
categories:
- wargames
- natas
date: '2026-04-07T01:41:09.000Z'
description: Natas Level 10 — the site now filters dangerous characters; learn why
  blocklists fail and how a legitimate tool's own features can be bent to your purpose.
draft: false
excerpt: Natas Level 10 — the site now filters dangerous characters; learn why blocklists
  fail and how a legitimate tool's own features can be bent to your purpose.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- natas
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 10
permalink: /docs/wargames/natas/natas10/
sidebar_label: Level 10
source_file: sites/wargames/overthewire/natas/natas10.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/natas/natas10.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Natas Level 10
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

    Username: natas10
    URL:      http://natas10.natas.labs.overthewire.org

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** sign in as `natas10` and find the password for `natas11`.
</div>

### What this level teaches

Why filtering out "bad" characters is fragile, and how to achieve the goal using only characters that are allowed.

### Key ideas

- **Blocklist vs allow-list.** A blocklist tries to list everything dangerous and always misses something; an allow-list accepts only what is known to be safe.
- **Same program, different use.** The command being run has options and arguments of its own. Even without chaining, you can steer what it searches and which files it reads.
- **Read the manual.** The program's man page is as useful here as it was in Bandit.

### How to approach it

1. Compare this level's code with the previous one and list what changed.
2. Ask what the allowed characters still let you tell the command to do.

### How developers prevent it

Do not construct shell commands from input. Use library functions that search text directly and never hand user data to a shell.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../natas9/">Level 9</a><a class="sg-index" href="../">Natas overview</a><a class="sg-next" href="../natas11/">Level 11</a></nav>

</section>

<!-- study-guide:end -->
