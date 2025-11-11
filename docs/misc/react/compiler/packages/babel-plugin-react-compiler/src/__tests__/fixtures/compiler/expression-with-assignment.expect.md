---
title: Expression With Assignment.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: expression-with-assignment.expect.md
---
# Expression With Assignment.Expect

## Input

```javascript
function f() {
  let x = 1;
  return x + (x = 2) + x;
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
  return 5;
}

export const FIXTURE_ENTRYPOINT = {
  fn: f,
  params: [],
  isComponent: false,
};

```

### Eval output
(kind: ok) 5