---
title: While Property.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: while-property.expect.md
---
## Input

```javascript
function foo(a, b) {
  let x = 0;
  while (a.b.c) {
    x += b;
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
function foo(a, b) {
  let x = 0;
  while (a.b.c) {
    x = x + b;
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      