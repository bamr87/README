---
coverage: listed
schema: '0.1'
source_file: sites/zer0-pages/pages/assets/backgrounds/noise/SCHEMA.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/assets/backgrounds/noise/SCHEMA.md
title: SCHEMA — noise
---

# SCHEMA — noise

> SVG noise textures generated with fffuel.co's nnnoise tool — one per theme skin.

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `*.svg` | pattern | Noise texture for the matching skin key in _data/theme_skins.yml (air, aqua, dark, ...) | |

## Placement

- New skin → its noise SVG here, wired up in `_data/theme_backgrounds.yml`.
