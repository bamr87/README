---
category: misc
last_updated: null
source_file: unused-logical.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x = 0;\n  props.cond ?\
  \ (x = 1) : (x = 2);\n  return x;\n}"
tags:
- javascript
title: Unused Logical.Expect
---

## Input

```javascript
function Component(props) {
  let x = 0;
  props.cond ? (x = 1) : (x = 2);
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function Component(props) {
  let x;
  props.cond ? (x = 1) : (x = 2);
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      