---
author: bamr87
categories:
- wargames
- natas
date: '2026-04-07T01:41:09.000Z'
description: Natas Level 14 — a login form builds its SQL query by pasting in your
  input; learn the basics of SQL injection and authentication bypass.
draft: false
excerpt: Natas Level 14 — a login form builds its SQL query by pasting in your input;
  learn the basics of SQL injection and authentication bypass.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- natas
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 14
permalink: /docs/wargames/natas/natas14/
sidebar_label: Level 14
source_file: sites/wargames/overthewire/natas/natas14.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/natas/natas14.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Natas Level 14
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

    Username: natas14
    URL:      http://natas14.natas.labs.overthewire.org

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** sign in as `natas14` and find the password for `natas15`.
</div>

### What this level teaches

SQL injection: input that changes the meaning of a database query.

### Key ideas

- **String concatenation is the flaw.** The code inserts the username and password directly into a query string, so quotes in your input can end the string and add logic.
- **Boolean logic.** A condition such as `1=1` is always true, so a `WHERE` clause containing `OR` of it matches every row.
- **Comments.** SQL comment markers can discard the remainder of a query.
- **Read the source.** The page provides it; the exact query shape tells you what to inject.

### How to approach it

1. Read the query the code builds and imagine the final text for ordinary input.
2. Work out how to complete or break out of the quoted strings to make the check always succeed.

### How developers prevent it

Use parameterised queries (prepared statements) so input is always data, never SQL.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../natas13/">Level 13</a><a class="sg-index" href="../">Natas overview</a><a class="sg-next" href="../natas15/">Level 15</a></nav>

</section>

<!-- study-guide:end -->
