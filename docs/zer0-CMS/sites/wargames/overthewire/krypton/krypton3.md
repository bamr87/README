---
author: bamr87
categories:
- wargames
- krypton
date: '2026-04-07T01:41:09.000Z'
description: Krypton Level 3 — recover a substitution key from several intercepted
  English messages using frequency analysis.
draft: false
excerpt: Krypton Level 3 — recover a substitution key from several intercepted English
  messages using frequency analysis.
keywords:
- security
- wargames
- linux
- ctf
- cybersecurity
- krypton
lastmod: '2026-04-07T01:41:09.000Z'
license: MIT
nav_order: 3
permalink: /docs/wargames/krypton/krypton3/
sidebar_label: Level 3
source_file: sites/wargames/overthewire/krypton/krypton3.md
source_name: overthewire
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/wargames/overthewire/krypton/krypton3.md
tags:
- security
- wargames
- linux
- ctf
- cybersecurity
title: Krypton Level 3
toc_sticky: true
---
> **Source:** This content is aggregated from [overthewire](https://github.com/OverTheWireOrg/OverTheWire-website) ([MIT](https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/LICENSE)). Visit the original repository for the latest version.

Level Info
----------
Well done. You've moved past an easy substitution cipher.

The main weakness of a simple substitution cipher is repeated use of a simple key. In the previous exercise you were able to introduce arbitrary plaintext to expose the key. In this example, the cipher mechanism is not available to you, the attacker.

However, you have been lucky. You have intercepted more than one message. The password to the next level is found in the file 'krypton4'. You have also found 3 other files. (found1, found2, found3)

You know the following important details:

- The message plaintexts are in American English (\*\*\* very important) -
They were produced from the same key (\*\*\* even better!)

Enjoy.

<!-- study-guide:start -->

<section class="study-guide" markdown="1">

## Study guide

<div class="sg-map" markdown="1">
**Level map:** logged in as `krypton3`, decrypt the file that holds the password for `krypton4`.
</div>

### What this level teaches

Frequency analysis, the classic attack on monoalphabetic substitution ciphers.

### Key ideas

- **Same key, many messages.** The page tells you the plaintexts are American English and were encrypted with the same key. More text means more reliable statistics.
- **Letter frequencies.** Count how often each ciphertext letter appears and match the ranking against English: E, T, A, O, I, N are most common.
- **Patterns beyond single letters.** Common words (THE, AND), common digraphs (TH, HE) and short words reveal further mappings.
- **Iterate.** Each correct guess exposes patterns that make the next guess easier.

### How to approach it

1. Count letters across all three found files together.
2. Make tentative guesses and apply them, then look at the partly decrypted text for recognisable words.
3. Refine the mapping until the target file reads as sensible English.

### Why it matters

Fixed substitution preserves the statistics of the language. Good modern ciphers are designed so ciphertext looks uniformly random.

<nav class="sg-nav" aria-label="Level navigation"><a class="sg-prev" href="../krypton2/">Level 2</a><a class="sg-index" href="../">Krypton overview</a><a class="sg-next" href="../krypton4/">Level 4</a></nav>

</section>

<!-- study-guide:end -->
