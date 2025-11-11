---
title: For Logical.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: for-logical.expect.md
---
# For Logical.Expect

## Input

```javascript
function foo(props) {
  let y = 0;
  for (
    let x = 0;
    x > props.min && x < props.max;
    x += props.cond ? props.increment : 2
  ) {
    x *= 2;
    y += x;
  }
  return y;
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
  let y = 0;
  for (
    let x = 0;
    x > props.min && x < props.max;
    x = x + (props.cond ? props.increment : 2), x
  ) {
    x = x * 2;
    y = y + x;
  }
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
