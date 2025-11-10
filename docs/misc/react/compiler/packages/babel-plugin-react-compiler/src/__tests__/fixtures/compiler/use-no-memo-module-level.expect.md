---
title: Use No Memo Module Level.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: use-no-memo-module-level.expect.md
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
      