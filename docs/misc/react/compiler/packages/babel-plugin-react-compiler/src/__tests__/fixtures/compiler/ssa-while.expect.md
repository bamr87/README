---
title: Ssa While.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: ssa-while.expect.md
---
# Ssa While.Expect

## Input

```javascript
function foo() {
  let x = 1;
  while (x < 10) {
    x = x + 1;
  }

  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
function foo() {
  let x = 1;
  while (x < 10) {
    x = x + 1;
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```

### Eval output
(kind: ok) 10