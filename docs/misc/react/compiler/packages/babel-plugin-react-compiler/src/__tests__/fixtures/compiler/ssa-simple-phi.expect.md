---
title: Ssa Simple Phi.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: ssa-simple-phi.expect.md
---
# Ssa Simple Phi.Expect

## Input

```javascript
function foo() {
  let y = 2;

  if (y > 1) {
    y = 1;
  } else {
    y = 2;
  }

  let x = y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
function foo() {}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```

### Eval output
(kind: ok)