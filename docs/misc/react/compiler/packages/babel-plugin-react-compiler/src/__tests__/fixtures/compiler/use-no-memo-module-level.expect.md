---
category: misc
last_updated: null
source_file: use-no-memo-module-level.expect.md
summary: '```javascript

  ''use no memo'';'
tags:
- javascript
title: Use No Memo Module Level.Expect
---

## Input

```javascript
'use no memo';

export default function foo(x, y) {
  if (x) {
    return foo(false, y);
  }
  return [y * 10];
}

```

## Code

```javascript
"use no memo";

export default function foo(x, y) {
  if (x) {
    return foo(false, y);
  }
  return [y * 10];
}

```
      