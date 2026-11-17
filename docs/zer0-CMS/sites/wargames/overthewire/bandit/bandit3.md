---
author: bamr87
categories:
- wargames
- bandit
date: '2026-04-07T01:41:08.000Z'
description: Bandit Level 3 — read a file whose name contains spaces by using quoting,
  escaping or tab completion.
draft: false
excerpt: Bandit Level 3 — read a file whose name contains spaces by using quoting,
  escaping or tab completion.
keywords:
- security
- wargames
- linux
- overthewire
- ctf
- cybersecurity
lastmod: '2026-04-07T01:41:08.000Z'
license: MIT
nav_order: 3
permalink: /docs/wargames/bandit/bandit3/
sidebar_label: Level 3
source_file: sites/wargames/overthewire/bandit/bandit3.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/bandit/bandit3.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Bandit Level 3
toc_sticky: true
---

> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

Level Goal
----------
The password for the next level is stored in a file called `--spaces in this filename--` located in the home directory

Commands you may need to solve this level
-----------------------------------------
[ls](https://manpages.ubuntu.com/manpages/noble/man1/ls.1.html) , [cd](https://manpages.ubuntu.com/manpages/noble/man1/cd.1posix.html) , [cat](https://manpages.ubuntu.com/manpages/noble/man1/cat.1.html) , [file](https://manpages.ubuntu.com/manpages/noble/man1/file.1.html) , [du](https://manpages.ubuntu.com/manpages/noble/man1/du.1.html) , [find](https://manpages.ubuntu.com/manpages/noble/man1/find.1.html)

Helpful Reading Material
------------------------
- [Google Search for "spaces in filename"][]

[Google Search for "spaces in filename"]: https://www.google.com/search?q=spaces+in+filename

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `bandit2`, find the password for `bandit3`.
</div>

### What this level teaches

How the shell splits a command line into words, and how to keep a filename with spaces together.

### Key ideas

- **Word splitting.** The shell breaks a command at every space, so `cat my file` is read as two arguments, `my` and `file`.
- **Quoting** (single or double quotes) and **backslash escaping** both tell the shell "treat this as one word".
- **Tab completion** has the shell finish a name for you, inserting the correct escapes automatically.

### How to approach it

1. `ls` shows the file. Note how its name appears.
2. Try the three techniques above on a harmless file first, for example one you create yourself in a `mktemp -d` directory.
3. Start typing the name and press Tab. Seeing the escapes the shell inserts is the quickest way to understand them.

### Why it matters

Spaces and special characters in filenames cause the classic scripting bugs. Always quoting variables in scripts (`"$file"`) comes directly from this lesson.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../bandit2/">Level 2</a><a class="sg-index" href="../">Bandit overview</a><a class="sg-next" href="../bandit4/">Level 4</a></nav>

</section>

<!-- study-guide:end -->
