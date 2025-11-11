---
title: Ternary Expression.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: ternary-expression.expect.md
---
# Ternary Expression.Expect

## Input

```javascript
function ternary(props) {
  const a = props.a && props.b ? props.c || props.d : (props.e ?? props.f);
  const b = props.a ? (props.b && props.c ? props.d : props.e) : props.f;
  return a ? b : null;
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
  const a = props.a && props.b ? props.c || props.d : (props.e ?? props.f);
  const b = props.a ? (props.b && props.c ? props.d : props.e) : props.f;
  return a ? b : null;
}

export const FIXTURE_ENTRYPOINT = {
  fn: ternary,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
