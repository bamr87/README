---
objectives:
- hint: head -n 3 ballad.txt
  solution: head -n 3 ballad.txt
  text: 'Show only the first 3 lines: head -n 3 ballad.txt'
  when:
    all:
    - command: head
    - args_contains: ballad.txt
    - any:
      - arg: '3'
      - arg: '-3'
      - arg: -n3
- hint: tail -n 2 ballad.txt
  solution: tail -n 2 ballad.txt
  text: Show only the last 2 lines with tail
  when:
    all:
    - command: tail
    - args_contains: ballad.txt
    - any:
      - arg: '2'
      - arg: '-2'
      - arg: -n2
source_file: 02-head-and-tail.md
teaches:
- head
- tail
- -n
title: 02 Head And Tail
xp: 20
---
Long files don't fit on one screen. You rarely need all of them anyway:

- `head FILE` shows the first 10 lines, and `head -n 3 FILE` shows the first 3.
- `tail FILE` shows the last 10, and `tail -n 2 FILE` shows the last 2.

```
head -n 3 ballad.txt
tail -n 2 ballad.txt
```

Real world: a log file grows at the bottom, so `tail` is where the news is. On a real system, `tail -f app.log` *follows* the file and prints new lines the moment they're written. That's how people watch a server live.
