---
author: bamr87
categories:
- wargames
- leviathan
date: '2026-04-07T01:41:09.000Z'
description: Leviathan Level 0 — explore your starting home directory for something
  that does not show up in an ordinary listing.
draft: false
excerpt: Leviathan Level 0 — explore your starting home directory for something that
  does not show up in an ordinary listing.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- leviathan
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 0
permalink: /docs/wargames/leviathan/leviathan0/
sidebar_label: Level 0
source_file: sites/wargames/overthewire/leviathan/leviathan0.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/leviathan/leviathan0.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Leviathan Level 0
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

There is no information for this level, intentionally.

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `leviathan0`, find the password for `leviathan1`.
</div>

### What this level teaches

Careful reconnaissance: always look for what a default view hides.

### Key ideas

- **Hidden entries.** Files and directories starting with a dot are skipped by a plain `ls`. `ls -la` shows them.
- **Recognising what you find.** A backup of an ordinary application file may hold data you would not expect to find on a server.
- **Searching, not scrolling.** If a file is large, `grep` for a likely word instead of reading it all.

### How to approach it

1. Log in with the credentials on the index page and list your home directory with all entries.
2. Look inside anything unusual and search it for the word you need.

### Why it matters

Backups, old exports and leftovers regularly leak data in real incidents.

<nav class="sg-nav" aria-label="Level navigation"><span></span><a class="sg-index" href="../">Leviathan overview</a><a class="sg-next" href="../leviathan1/">Level 1</a></nav>

</section>

<!-- study-guide:end -->
