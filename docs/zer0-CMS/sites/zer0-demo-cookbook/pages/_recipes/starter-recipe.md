---
cookbook: zer0-demo-cookbook
course: mains
cuisine: Italian
description: A twenty-minute pantry pasta that shows every field a recipe on The Sunday
  Braise can carry.
difficulty: easy
equipment:
- Large pot
- Wide skillet
ingredients:
- group: Pasta
  items:
  - item: dried spaghetti
    qty: 200
    unit: g
  - item: salt
    note: For the pasta water.
    qty: 1
    unit: tbsp
- group: Sauce
  items:
  - item: olive oil
    qty: 2
    unit: tbsp
  - item: garlic cloves
    prep: thinly sliced
    qty: 2
    singular: garlic clove
  - item: canned whole tomatoes
    prep: crushed by hand
    qty: 400
    unit: g
  - item: fresh basil
    prep: torn
    qty: 0.25
    unit: cup
lastmod: 2026-09-08
layout: recipe
notes:
- Swap the basil for parsley in winter; add chilli flakes with the garlic for heat.
source_file: sites/zer0-demo-cookbook/pages/_recipes/starter-recipe.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-demo-cookbook/pages/_recipes/starter-recipe.md
steps:
- text: Bring a large pot of water to the boil, salt it well, and cook the spaghetti
    one minute short of the packet time.
  time: 10
  title: Boil
- text: Warm the oil in a wide skillet, soften the garlic without colouring it, add
    the tomatoes and simmer until glossy.
  time: 8
  title: Sauce
- text: Drag the pasta into the sauce with a splash of its water, toss over high heat
    for a minute, and finish with basil.
  time: 2
  title: Finish
tags:
- pasta
- quick
- vegetarian
times:
  cook: 15
  prep: 5
title: 'Starter Recipe: Weeknight Tomato Pasta'
yield:
  amount: 2
  singular: serving
  unit: servings
---

This starter recipe exists so the cookbook has something to render on day one. Replace it, or copy its front matter for your own recipes — `yield`, `times`, `ingredients` groups and `steps` drive the scaler, the unit switch and the timings bar.
