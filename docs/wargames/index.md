---
title: Wargames & Security Challenges
summary: Documentation from wargame and security challenge repositories
category: wargames
tags:
  - wargames
  - security
  - ctf
---

# Wargames & Security Challenges

This is a hand-written landing page, not aggregated output — it is the one page under `docs/` the pipeline does not generate. The walkthroughs themselves live in the [OverTheWire](../OverTheWire-website/README.md) section, aggregated from the upstream [OverTheWireOrg/OverTheWire-website](https://github.com/OverTheWireOrg/OverTheWire-website) repository (`gh-pages` branch, MIT). That repo is registered in `_data/projects.yml` as an `external` reference corpus: the fleet's own `bamr87/wargames` repo vendors a curated subset of the same material, so the upstream is crawled here rather than the fork, and it is intentionally not one of the hub's submodules.

## OverTheWire Wargames

The [OverTheWire](https://overthewire.org/wargames/) wargames help you learn and practice security concepts through fun, hands-on challenges. Each game teaches different skills:

| Game | Focus Area |
|------|-----------|
| **Bandit** | Linux basics, SSH, file operations |
| **Natas** | Web security fundamentals |
| **Leviathan** | Binary exploitation basics |
| **Krypton** | Cryptography |
| **Narnia** | Buffer overflow exploitation |
| **Behemoth** | Advanced binary exploitation |
| **Utumno** | Advanced reverse engineering |
| **Maze** | Advanced exploitation techniques |
| **Vortex** | Systems programming security |
| **Manpage** | Man page-based challenges |
| **Drifter** | Advanced Linux exploitation |
| **FormulaOne** | Race condition exploitation |

Browse the [OverTheWire](../OverTheWire-website/README.md) section for the level-by-level documentation.
