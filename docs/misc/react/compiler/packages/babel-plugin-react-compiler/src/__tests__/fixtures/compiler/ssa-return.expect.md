---
title: Ssa Return.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: ssa-return.expect.md
---
# Ssa Return.Expect

## Input

```javascript
function foo() {
  let x = 1;
  if (x === 1) {
    x = 2;
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
  return 2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```

### Eval output
(kind: ok) 2