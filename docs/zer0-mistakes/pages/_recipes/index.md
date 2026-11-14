---
author: The zer0-mistakes theme
cookbook: zer0-kitchen
description: 'Three worked recipes that exercise the whole cookbook collection: structured
  ingredients, baker''s-percentage ratios, serving scaling, and live US↔metric conversion.'
lastmod: 2026-08-23 00:00:00+00:00
layout: cookbook
permalink: /recipes/
sitemap: true
source_file: pages/_recipes/index.md
source_repo: bamr87/zer0-mistakes
source_url: https://github.com/bamr87/zer0-mistakes/blob/main/pages/_recipes/index.md
subtitle: A demo cookbook for the recipes collection
title: The Zer0 Kitchen
---

**The Zer0 Kitchen** ships with the theme so you can see the `recipes` collection end to end before writing a recipe of your own. Each one below is deliberately different:

- **[[zer0-mistakes/pages/_recipes/no-knead-focaccia|No-Knead Focaccia]]** is written in grams, so it shows the ratio table doing what it is for — every ingredient as a percentage of the flour — and converts *down* to cups when you ask for US units.
- **[[zer0-mistakes/pages/_recipes/brown-butter-chocolate-chip-cookies|Brown Butter Chocolate Chip Cookies]]** is written in cups and spoons, so it shows the reverse trip: switch to metric and every volume becomes a weight, using the densities in `_data/ingredient_densities.yml`.
- **[[zer0-mistakes/pages/_recipes/weeknight-tomato-butter-pasta|Weeknight Tomato-Butter Pasta]]** has no formula worth tabulating, so its ratio section simply does not render — and it shows quantity *ranges* ("4–6 cloves") and countable ingredients scaling sensibly.

Try the controls at the top of any recipe: change the servings, then switch between **As written**, **Metric**, and **US**. Nothing on the page is generated at build time for a specific scale — the amounts you land on are computed in the browser, and the page is complete and correct with JavaScript switched off.

To build your own cookbook, copy this folder's shape: one file per recipe with `layout: recipe` (the collection default) and structured front matter, plus an `index.md` with `layout: cookbook`. The full guide lives at [[zer0-mistakes/pages/_docs/features/cookbook-collection|Cookbook collection]].
