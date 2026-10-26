---
objectives:
- hint: nl ballad.txt
  solution: nl ballad.txt
  text: Number every line of the ballad with nl
  when:
    all:
    - command: nl
    - args_contains: ballad.txt
- hint: less ballad.txt, then Space for the next page, b to go back, q to quit
  solution: less ballad.txt
  text: 'Open the ballad in the pager: less ballad.txt (q quits)'
  when:
    all:
    - command: less
    - args_contains: ballad.txt
source_file: 04-numbers-and-pages.md
teaches:
- nl
- less
title: 04 Numbers And Pages
xp: 25
---
- `nl FILE` prints a file with **line numbers**, which helps when someone says "look at line 7".
- `less FILE` is a **pager**. It shows one screen at a time: Space or PgDn goes forward, b or PgUp goes back, q quits. It never loads the whole file at once, so it opens huge logs instantly.

```
nl ballad.txt
less ballad.txt
```

Real world: `man` pages open in `less`. Anything you learn here (Space, b, q, and `/word` to search on a real system) works there too.
