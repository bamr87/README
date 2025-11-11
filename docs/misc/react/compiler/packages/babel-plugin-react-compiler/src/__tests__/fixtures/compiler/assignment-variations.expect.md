---
title: Assignment Variations.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: assignment-variations.expect.md
---
# Assignment Variations.Expect

## Input

```javascript
function f() {
  let x = 1;
  x = x + 1;
  x += 1;
  x >>>= 1;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: f,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
function f() {
  return 1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: f,
  params: [],
  isComponent: false,
};

```

### Eval output
(kind: ok) 1