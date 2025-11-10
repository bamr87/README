---
category: misc
last_updated: null
source_file: rules-of-hooks-485bf041f55f.expect.md
summary: "```javascript\n// Valid because functions can call functions.\nfunction\
  \ functionThatStartsWithUseButIsntAHook() {\n  if (cond) {\n    userFetch();\n \
  \ }\n}"
tags:
- javascript
title: Rules Of Hooks 485Bf041F55F.Expect
---

## Input

```javascript
// Valid because functions can call functions.
function functionThatStartsWithUseButIsntAHook() {
  if (cond) {
    userFetch();
  }
}

```

## Code

```javascript
// Valid because functions can call functions.
function functionThatStartsWithUseButIsntAHook() {
  if (cond) {
    userFetch();
  }
}

```
      