---
gamename: semtex
layout: default
level: 4
source_file: wargames/semtex/semtex4.md
source_repo: OverTheWireOrg/OverTheWire-website
source_url: https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/wargames/semtex/semtex4.md
title: Semtex4
---
Ptrace your way
---------------

Pass prints the password for the level you are on. Try to make it print the next level's password. This time it is not so easy:

    /semtex/semtex4: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), statically linked, for GNU/Linux 2.6.15, stripped

Tip :
-   Pass uses geteuid() to get its information.
-   Read man ptrace

