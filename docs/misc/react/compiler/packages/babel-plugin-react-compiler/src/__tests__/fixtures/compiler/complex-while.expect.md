---
title: Complex While.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: complex-while.expect.md
---
## Input

```javascript
function foo(a, b, c) {
  label: if (a) {
    while (b) {
      if (c) {
        break label;
      }
    }
  }
  return c;
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
  bb0: if (a) {
    while (b) {
      if (c) {
        break bb0;
      }
    }
  }
  return c;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      