---
objectives:
- hint: echo prints text; > sends it into a file
  solution: echo hello forge > note.txt
  text: 'Write a note: echo hello forge > note.txt'
  when:
    file_contains: /lab/workshop/note.txt
    text: hello
- hint: '>> appends instead of replacing'
  solution: echo second line >> note.txt
  text: 'Add a second line: echo second line >> note.txt'
  when:
    all:
    - file_contains: /lab/workshop/note.txt
      text: hello
    - file_contains: /lab/workshop/note.txt
      text: second
- hint: cat note.txt
  solution: cat note.txt
  text: 'Read it back: cat note.txt'
  when:
    all:
    - command: cat
    - output_includes: second
source_file: courses/workshop/05-write.md
source_repo: bamr87/bashcrawl
source_url: https://github.com/bamr87/bashcrawl/blob/main/courses/workshop/05-write.md
teaches:
- echo
- '>'
- '>>'
- cat
title: Writing files from the shell
xp: 25
---
You don't need an editor for small files. `echo` plus a redirect is enough:

```
echo hello forge > note.txt
echo second line >> note.txt
cat note.txt
```

The rule from the pipelines course still holds: `>` replaces, `>>` appends.

Real world: `echo "export PATH=$HOME/bin:$PATH" >> ~/.bashrc` is how a lot of install instructions add a line to your shell config. Now you know why it's `>>`.
