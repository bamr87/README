---
category: misc
last_updated: null
source_file: ternary-assignment-expression.expect.md
summary: "```javascript\nfunction ternary(props) {\n  let x = 0;\n  const y = props.a\
  \ ? (x = 1) : (x = 2);\n  return x + y;\n}"
tags:
- javascript
title: Ternary Assignment Expression.Expect
---

## Input

```javascript
function ternary(props) {
  let x = 0;
  const y = props.a ? (x = 1) : (x = 2);
  return x + y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: ternary,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function ternary(props) {
  let x;
  const y = props.a ? (x = 1) : (x = 2);
  return x + y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: ternary,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      