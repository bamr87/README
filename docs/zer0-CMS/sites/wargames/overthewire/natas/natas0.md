---
author: bamr87
categories:
- wargames
- natas
date: '2026-04-07T01:41:09.000Z'
description: Natas Level 0 — sign in to the first website and find a password the
  page does not show you but still sends to your browser.
draft: false
excerpt: Natas Level 0 — sign in to the first website and find a password the page
  does not show you but still sends to your browser.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- natas
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 0
permalink: /docs/wargames/natas/natas0/
sidebar_label: Level 0
source_file: sites/wargames/overthewire/natas/natas0.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/natas/natas0.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Natas Level 0
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

    Username: natas0
    Password: natas0
    URL:      http://natas0.natas.labs.overthewire.org

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** sign in as `natas0` and find the password for `natas1`.
</div>

### What this level teaches

That a web page is more than what you see on screen. Your browser receives HTML, CSS and JavaScript, and everything it receives is visible to you.

### Key ideas

- **HTTP Basic authentication.** The username and password in the level's description are sent with every request in a header; the browser pop-up is just a form for that header.
- **The page source.** The browser renders the HTML it was sent but you can read the raw text with "View Source" or the developer tools.
- **Client-side is public.** Anything sent to the browser, including HTML comments, can be read by the user.

### How to approach it

1. Log in with the credentials on this page.
2. Read the message on the page, then look at what is behind it.

### How developers prevent it

Never put secrets, credentials or internal notes in HTML, comments or JavaScript. Treat everything in the response as public.

<nav class="sg-nav" aria-label="Level navigation"><span></span><a class="sg-index" href="../">Natas overview</a><a class="sg-next" href="../natas1/">Level 1</a></nav>

</section>

<!-- study-guide:end -->
