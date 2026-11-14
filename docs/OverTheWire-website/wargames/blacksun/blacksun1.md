---
gamename: blacksun
layout: default
level: 1
source_file: wargames/blacksun/blacksun1.md
source_repo: OverTheWireOrg/OverTheWire-website
source_url: https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/wargames/blacksun/blacksun1.md
title: Blacksun1
---
Level1 is a trivial stack buffer overflow. Note that you'll probably find it easier to use the compiled version than compiling it from source.

### Binary information

| Stack smashing protection (SSP): 	      | Disabled	|
| Postition Independent Executable (PIE):     | Disabled	|
| Address space layout randomisation (ASLR):  | Enabled - No PIE|
| Non-executable pages: 		      | None / disabled	|
|--------------------------------------------:+:----------------|
| Location: 				      | /levels/level1  |

{% include showFile.html path="blacksun1.c" %}
