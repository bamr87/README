---
title: Trivial.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: trivial.expect.md
---
# Trivial.Expect

## Input

```javascript
function foo(x) {
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
function foo(x) {
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
