---
objectives:
- hint: sort names.txt
  solution: sort names.txt
  text: Sort names.txt alphabetically
  when:
    all:
    - command: sort
    - args_contains: names.txt
- hint: Run uniq straight on the file and compare with the sorted version
  solution: uniq names.txt
  text: 'See why order matters: uniq names.txt (without sorting first)'
  when:
    all:
    - command: uniq
    - args_contains: names.txt
    - piped: false
- hint: Sort first, so duplicates sit next to each other
  solution: sort names.txt | uniq
  text: 'List each name once: sort names.txt | uniq'
  when:
    all:
    - command: uniq
    - piped: true
    - line_includes: sort
- hint: -c prefixes each line with how many times it appeared
  solution: sort names.txt | uniq -c
  text: 'Count each name: sort names.txt | uniq -c'
  when:
    all:
    - command: uniq
    - option: c
    - piped: true
source_file: 03-sort-and-uniq.md
teaches:
- sort
- uniq
- uniq -c
title: 03 Sort And Uniq
xp: 30
---
- `sort` puts lines in order: `-r` reverses it, and `-n` sorts by number instead of by text.
- `uniq` collapses **adjacent** duplicate lines, and `-c` counts them.

That word *adjacent* matters. `uniq` only compares each line with the one right before it, so you nearly always `sort` first:

```
uniq names.txt
sort names.txt | uniq
sort names.txt | uniq -c
```

Real world: `sort | uniq -c` is the shell's GROUP BY. It's how you count visitors per IP, errors per type, or commits per author.
