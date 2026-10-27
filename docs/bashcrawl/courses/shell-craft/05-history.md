---
objectives:
- hint: history lists your recent command lines
  solution: history
  text: 'Review what you''ve typed: history'
  when:
    all:
    - command: history
- hint: Redirect history into a file like any other output
  solution: history > history.txt
  text: 'Keep a record: history > history.txt'
  when:
    all:
    - file_exists: /lab/shell-craft/history.txt
    - line_includes: history
source_file: 05-history.md
teaches:
- history
- redirection
title: 05 History
xp: 30
---
Every line you type is remembered. `history` lists them, and the Up and Down arrows walk back through them.

```
history
history > history.txt
```

On a real bash shell you also get:

- `!!`: run the last command again (`sudo !!` is a classic).
- `Ctrl+R`: search your history as you type.
- `~/.bash_history`: where it all persists between sessions.

That's the whole course: variables remember, aliases shorten, globs multiply, quotes protect, and history never forgets. You now have the vocabulary to read almost any shell script you come across.
