---
objectives:
- hint: 'Type exactly: cd /lab/navigator'
  solution: cd /lab/navigator
  text: 'Walk into the lab by its absolute path: cd /lab/navigator'
  when:
    all:
    - command: cd
    - cwd: /lab/navigator
- hint: 'pwd takes no arguments: just type pwd'
  solution: pwd
  text: Ask the shell where you are with pwd
  when:
    all:
    - command: pwd
    - cwd_includes: /lab/navigator
source_file: 01-where-am-i.md
teaches:
- pwd
- cd
- absolute paths
title: 01 Where Am I
xp: 20
---
A shell always has a **current working directory**: the directory your commands act on unless you name another one.

- `pwd` (*print working directory*) tells you where that is.
- `cd PATH` (*change directory*) moves you there.

A path that starts with `/` is **absolute**. It begins at the very top of the filesystem (the *root*), so it means the same thing wherever you stand.

```
cd /lab/navigator
pwd
```

Real world: the first thing a sysadmin types after logging into an unfamiliar server is often `pwd`. Commands like `rm` act on "here", so knowing where "here" is matters.
