---
author: bamr87
categories:
- wargames
- semtex
date: '2026-04-07T01:41:09.000Z'
description: Semtex Level 12 — an authentication daemon and a remote file reader,
  where speed matters because the server is fast.
draft: false
excerpt: Semtex Level 12 — an authentication daemon and a remote file reader, where
  speed matters because the server is fast.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- semtex
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 12
permalink: /docs/wargames/semtex/semtex12/
sidebar_label: Level 12
source_file: sites/wargames/overthewire/semtex/semtex12.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/semtex/semtex12.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Semtex Level 12
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

Authentication Daemon
---------------------
There is an authentication daemon waiting on brebera port 24012. You connect to it, supply your password and get authenticated. The semtex 12 password will give you user access, the admin password will give you administrator access...

After authentication you connect to the remote file system reader on port 24013. Depending on your access level you can list files and show them. The semtex 13 password has been located in one of the files on this remote file system. Brebera is fast, can you be faster?

Thanks to bk for this level!

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** the authentication daemon is on port 24012 and the file reader on port 24013 of the Semtex network host.
</div>

### What this level teaches

Multi-step network protocols and timing-sensitive attacks.

### Key ideas

- **Two services.** You authenticate on one port, then use the other to list and read files, with the privilege level depending on your credentials.
- **Passwords by level.** The Semtex 12 password gives user access, while an admin password gives more.
- **A fast server.** The page asks whether you can be faster, which suggests a timing-dependent weakness.
- **Where the target is.** The Semtex 13 password is in one of the files on the remote file system.

### How to approach it

1. Explore both services manually with netcat.
2. Look for a gap in time or sequence between authentication and authorisation.
3. Script the sequence and run it quickly.

### Why it matters

Race conditions between check and use are a persistent class of real vulnerability.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../semtex11/">Level 11</a><a class="sg-index" href="../">Semtex overview</a><span></span></nav>

</section>

<!-- study-guide:end -->
