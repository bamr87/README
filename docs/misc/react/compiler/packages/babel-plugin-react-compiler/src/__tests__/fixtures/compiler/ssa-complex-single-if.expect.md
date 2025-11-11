---
title: Ssa Complex Single If.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: ssa-complex-single-if.expect.md
---
# Ssa Complex Single If.Expect

## Input

```javascript
function foo() {
  let x = 1;
  let y = 2;
  if (y === 2) {
    x = 3;
  }

  y = x;
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