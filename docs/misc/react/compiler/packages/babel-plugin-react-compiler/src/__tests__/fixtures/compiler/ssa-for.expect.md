---
title: Ssa For.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: ssa-for.expect.md
---
# Ssa For.Expect

## Input

```javascript
function foo() {
  let x = 1;
  for (let i = 0; i < 10; i++) {
    x += 1;
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
  for (let i = 0; i < 10; i++) {
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
(kind: ok) 11