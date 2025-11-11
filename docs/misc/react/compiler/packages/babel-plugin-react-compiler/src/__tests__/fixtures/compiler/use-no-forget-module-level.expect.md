---
title: Use No Forget Module Level.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: use-no-forget-module-level.expect.md
---
# Use No Forget Module Level.Expect

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
