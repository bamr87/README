---
gamename: vortex
layout: default
level: 7
source_file: wargames/vortex/vortex7.md
source_repo: OverTheWireOrg/OverTheWire-website
source_url: https://github.com/OverTheWireOrg/OverTheWire-website/blob/gh-pages/wargames/vortex/vortex7.md
title: Vortex7
---
Checksum Fun
------------
This level requires CRC\_32(argv[1], strlen(argv[1])) to be 0xe1ca95ee. You might need to extract the crc tables from the program.

Reading Material
----------------
- [CRC and How to Reverse It][]
- [CRC and How to Reverse It (mirror)]

{% include showFile.html path="vortex7.c" %}

[CRC and How to Reverse It]: http://www.woodmann.com/fravia/crctut1.htm
[CRC and How to Reverse It (mirror)]: http://taz.newffr.com/TAZ/Reverse_Engineering/CRC.html
