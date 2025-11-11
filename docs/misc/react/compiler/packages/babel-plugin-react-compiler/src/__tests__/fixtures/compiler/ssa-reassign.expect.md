---
title: Ssa Reassign.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: ssa-reassign.expect.md
---
# Ssa Reassign.Expect

## Input

```javascript
function foo(a, b, c) {
  let x = 0;
  x = a;
  x = b;
  x = c;
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
function foo(a, b, c) {
  let x;

  x = c;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
