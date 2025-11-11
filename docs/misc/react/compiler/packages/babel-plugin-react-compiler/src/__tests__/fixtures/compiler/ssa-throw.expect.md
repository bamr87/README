---
title: Ssa Throw.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: ssa-throw.expect.md
---
# Ssa Throw.Expect

## Input

```javascript
function foo() {
  let x = 1;
  if (x === 1) {
    x = 2;
  }
  throw x;
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
  throw 2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```

### Eval output
(kind: exception) undefined