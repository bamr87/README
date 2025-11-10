---
title: Expression With Assignment Dynamic.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: expression-with-assignment-dynamic.expect.md
---
## Input

```javascript
function f(y) {
  let x = y;
  return x + (x = 2) + x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: f,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function f(y) {
  let x = y;
  return x + (x = 2) + 2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: f,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      