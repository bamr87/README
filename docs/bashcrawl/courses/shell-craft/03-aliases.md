---
objectives:
- hint: Quote the command so the space stays inside it
  solution: alias ll='ls -F'
  text: 'Make a shortcut: alias ll=''ls -F'''
  when:
    exists: aliases.ll
- hint: Just ll, and the shell expands it to ls -F
  solution: ll
  text: 'Use it: type ll'
  when:
    all:
    - command: ls
    - option: F
    - exists: aliases.ll
    - not:
        line_includes: ls
- hint: alias with no arguments lists them all
  solution: alias
  text: 'List your aliases: alias'
  when:
    all:
    - command: alias
    - output_includes: alias ll=
source_file: 03-aliases.md
teaches:
- alias
- shortcuts
title: 03 Aliases
xp: 25
---
An **alias** is a nickname for a longer command line. The shell swaps it in before running anything.

```
alias ll='ls -F'
ll
alias
```

The quotes matter: without them, `alias ll=ls -F` gives the alias only `ls`, and `-F` becomes a separate argument.

Real world: aliases live in `~/.bashrc` or `~/.zshrc`, so they load in every new shell. Common ones are `ll`, `la`, `..='cd ..'`, and `gs='git status'`.
