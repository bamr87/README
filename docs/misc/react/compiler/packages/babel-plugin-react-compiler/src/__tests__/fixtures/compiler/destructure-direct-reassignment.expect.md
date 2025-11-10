---
category: misc
last_updated: null
source_file: destructure-direct-reassignment.expect.md
summary: "``javascript\n// @enablePreserveExistingMemoizationGuarantees:false\nfunction\
  \ foo(props) {\n  let x, y;\n  ({x, y} = {x: props.a, y: props.b});\n  console.log(x);\
  \ // prevent DCE from eliminating x` altoget..."
tags:
- javascript
title: Destructure Direct Reassignment.Expect
---

## Input

```javascript
// @enablePreserveExistingMemoizationGuarantees:false
function foo(props) {
  let x, y;
  ({x, y} = {x: props.a, y: props.b});
  console.log(x); // prevent DCE from eliminating `x` altogether
  x = props.c;
  return x + y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
// @enablePreserveExistingMemoizationGuarantees:false
function foo(props) {
  let x;
  let y;
  ({ x, y } = { x: props.a, y: props.b });
  console.log(x);
  x = props.c;
  return x + y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      