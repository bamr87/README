---
title: While Break.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: while-break.expect.md
---
# While Break.Expect

## Input

```javascript
function foo(a, b) {
  while (a) {
    break;
  }
  return b;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function foo(a, b) {
  while (a) {
    break;
  }
  return b;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
