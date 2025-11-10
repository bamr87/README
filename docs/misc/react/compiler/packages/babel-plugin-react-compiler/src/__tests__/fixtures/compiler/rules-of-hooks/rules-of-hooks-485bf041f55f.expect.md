---
title: Rules Of Hooks 485Bf041F55F.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: rules-of-hooks-485bf041f55f.expect.md
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
      