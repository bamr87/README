---
cookbook: zer0-kitchen
course: desserts
cuisine: American
description: Written in cups and spoons the way it was handed down — switch the units
  to metric and every volume becomes the weight you should actually be measuring.
difficulty: intermediate
equipment:
- Light-coloured skillet — you cannot see butter brown in a dark one
- Stand mixer or a bowl and a strong arm
- Two half-sheet pans and parchment
- Kitchen scale, if you switch this recipe to metric
ingredients:
- group: Dough
  items:
  - item: unsalted butter
    prep: browned and cooled slightly
    qty: 1
    unit: cup
  - item: light brown sugar
    prep: packed
    qty: 1
    unit: cup
  - item: granulated sugar
    qty: 0.5
    unit: cup
  - item: large eggs
    qty: 2
    singular: large egg
  - item: egg yolks
    note: The extra yolk is what makes these chewy rather than cakey.
    qty: 1
    singular: egg yolk
  - item: vanilla extract
    qty: 2
    unit: tsp
  - item: all-purpose flour
    qty: 2.25
    unit: cups
  - item: baking soda
    qty: 1
    unit: tsp
  - grams_per_cup: 145
    item: kosher salt
    note: Diamond Crystal. Morton's is nearly twice as dense — use half as much, or
      set your own grams_per_cup in the front matter.
    qty: 1
    unit: tsp
- group: Mix in
  items:
  - item: semisweet chocolate chips
    qty: 1.5
    unit: cups
  - item: flaky sea salt
    optional: true
    prep: for finishing
lastmod: 2026-08-23 00:00:00+00:00
layout: recipe
notes:
- Switch the units to **Metric** and the cup measures resolve to the weights a bakery
  would use — 227 g butter, 281 g flour. That conversion is driven by `_data/ingredient_densities.yml`,
  so it is only as good as the density table; pin an exact value with `grams_per_cup:`
  on any ingredient.
- Scaling to 12 cookies halves an egg. Beat one egg, weigh it, and use half — or make
  the full batch and freeze half the dough in scooped balls.
- Underbaking is the whole technique. Pull them a minute before you think.
nutrition:
  basis: serving
  calories: 195
  carbohydrates: 25
  fat: 10
  protein: 2
  saturated_fat: 6
  sodium: 125
  sugar: 16
oven:
  temp_f: 375
permalink: /recipes/brown-butter-chocolate-chip-cookies/
ratio_basis: flour
source_file: brown-butter-chocolate-chip-cookies.md
steps:
- text: Melt the butter in a light-coloured skillet over medium heat, swirling, until
    it foams, quiets down, and the milk solids at the bottom turn deep amber and smell
    like toffee. Scrape every bit into the mixing bowl, solids included, and let it
    cool until barely warm.
  time: 10
  title: Brown the butter
- text: Beat in both sugars until glossy and thick, about 2 minutes. Add the eggs,
    the extra yolk and the vanilla, and beat another minute — the batter should lighten
    in colour.
  time: 5
  title: Cream
- text: Whisk the flour, baking soda and salt together in a separate bowl, then fold
    into the wet mixture until barely combined. Fold in the chocolate. Stop while
    you can still see streaks of flour disappearing.
  time: 5
  title: Combine
- text: 'Cover and refrigerate for at least an hour, and up to three days. This is
    not optional: cold dough spreads less and tastes noticeably deeper.'
  time: 60
  title: Chill
- temp_f: 375
  text: Scoop into balls about 2 tbsp each, spaced well apart on parchment. Bake until
    the edges are set and the centres still look underdone — they will finish on the
    sheet.
  time: 12
  title: Bake
- text: Rap the pan once on the counter as it comes out to give the cookies their
    ripples, scatter over the flaky salt, and cool on the pan for 5 minutes before
    moving them.
  time: 5
  title: Finish
tags:
- cookies
- baking
- dessert
- brown-butter
times:
  cook: 12
  prep: 25
  rest: 60
  rest_label: Chill
title: Brown Butter Chocolate Chip Cookies
yield:
  amount: 24
  singular: cookie
  unit: cookies
---
This is the recipe most people already have, written the way most people already have it: in cups. It is here to make a point about units. A cup of flour is anywhere from 120 to 145 grams depending on how you fill it, which is the single biggest reason the same cookie recipe behaves differently in two kitchens. Leave it in cups if that is how you cook — or press **Metric** and bake the version that repeats.
