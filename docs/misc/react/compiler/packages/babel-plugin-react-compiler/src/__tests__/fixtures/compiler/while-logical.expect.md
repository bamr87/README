---
title: While Logical.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: while-logical.expect.md
---
## Input

```javascript
function foo(props) {
  let x = 0;
  while (x > props.min && x < props.max) {
    x *= 2;
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
function foo(props) {
  let x = 0;
  while (x > props.min && x < props.max) {
    x = x * 2;
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      