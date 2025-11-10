---
category: misc
last_updated: null
source_file: use-no-forget-module-level.expect.md
summary: '```javascript

  ''use no forget'';'
tags:
- javascript
title: Use No Forget Module Level.Expect
---

## Input

```javascript
'use no forget';

export default function foo(x, y) {
  if (x) {
    return foo(false, y);
  }
  return [y * 10];
}

```

## Code

```javascript
"use no forget";

export default function foo(x, y) {
  if (x) {
    return foo(false, y);
  }
  return [y * 10];
}

```
      