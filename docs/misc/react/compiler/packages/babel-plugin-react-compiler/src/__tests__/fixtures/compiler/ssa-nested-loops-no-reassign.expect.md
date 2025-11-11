---
title: Ssa Nested Loops No Reassign.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: ssa-nested-loops-no-reassign.expect.md
---
# Ssa Nested Loops No Reassign.Expect

## Input

```javascript
// @xonly
function foo(a, b, c) {
  let x = 0;
  while (a) {
    while (b) {
      while (c) {
        x + 1;
      }
    }
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
// @xonly
function foo(a, b, c) {
  while (a) {
    while (b) {
      while (c) {}
    }
  }
  return 0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
