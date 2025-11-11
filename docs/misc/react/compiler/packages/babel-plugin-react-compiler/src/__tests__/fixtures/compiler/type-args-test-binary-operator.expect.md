---
title: Type Args Test Binary Operator.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: type-args-test-binary-operator.expect.md
---
# Type Args Test Binary Operator.Expect

## Input

```javascript
function component(a, b) {
  if (a > b) {
    let m = {};
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function component(a, b) {
  if (a > b) {
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
