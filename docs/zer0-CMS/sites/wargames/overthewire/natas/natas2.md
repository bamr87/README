---
author: bamr87
categories:
- wargames
- natas
date: '2026-04-07T01:41:09.000Z'
description: Natas Level 2 — notice that the page loads a resource you can follow,
  and discover what an exposed directory listing reveals.
draft: false
excerpt: Natas Level 2 — notice that the page loads a resource you can follow, and
  discover what an exposed directory listing reveals.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- natas
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 2
permalink: /docs/wargames/natas/natas2/
sidebar_label: Level 2
source_file: sites/wargames/overthewire/natas/natas2.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/natas/natas2.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Natas Level 2
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

    Username: natas2
    URL:      http://natas2.natas.labs.overthewire.org

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** sign in as `natas2` and find the password for `natas3`.
</div>

### What this level teaches

How to enumerate the resources a page loads and explore the directories they live in.

### Key ideas

- **A page references other files.** Images, scripts and stylesheets each have a URL, and those URLs reveal folder names.
- **Directory listing.** If a web server has "autoindex" enabled and a directory has no index page, visiting it lists every file inside.
- **Walking up the path.** Removing the last part of a URL moves you to the parent folder, a basic reconnaissance move.

### How to approach it

1. Read the source and list every resource the page references.
2. Visit the folder that holds a resource and see what the server shows you.

### How developers prevent it

Disable directory listings, keep sensitive files out of the web root, and treat every file reachable by URL as public.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../natas1/">Level 1</a><a class="sg-index" href="../">Natas overview</a><a class="sg-next" href="../natas3/">Level 3</a></nav>

</section>

<!-- study-guide:end -->
