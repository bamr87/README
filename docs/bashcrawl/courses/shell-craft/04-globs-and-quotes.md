---
objectives:
- hint: '* matches any run of characters within one name'
  solution: echo spells/*.txt
  text: 'Let the shell expand a glob: echo spells/*.txt'
  when:
    all:
    - command: echo
    - output_includes: fire.txt
    - not:
        output_includes: wind.log
- hint: Single quotes stop expansion
  solution: echo 'spells/*.txt'
  text: 'Quote it and the shell leaves it alone: echo ''spells/*.txt'''
  when:
    all:
    - command: echo
    - output_includes: '*.txt'
- hint: Quoted, so find (not the shell) does the matching, in every subdirectory
  solution: find . -name '*.log'
  text: 'Hand the pattern to find instead: find . -name ''*.log'''
  when:
    all:
    - command: find
    - output_includes: wind.log
source_file: 04-globs-and-quotes.md
teaches:
- globbing
- '*'
- quoting
- find -name
title: 04 Globs And Quotes
xp: 30
---
Start in your lab: `cd /lab/shell-craft`.

A **glob** is a filename pattern: `*` matches any run of characters, and `?` matches exactly one character. The **shell** expands a glob into matching names *before* the command runs. `echo` never sees the `*`.

```
echo spells/*.txt
echo 'spells/*.txt'
find . -name '*.log'
```

**Quotes** stop the expansion. That's why `find -name '*.log'` is quoted: you want `find` to receive the pattern and match it in every directory, not have the shell replace it with whatever matches *here*.

Type `explain echo spells/*.txt` to see what the glob expands to.
