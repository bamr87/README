---
category: misc
last_updated: null
source_file: logical-expression.expect.md
summary: "```javascript\nfunction component(props) {\n  let a = props.a || (props.b\
  \ && props.c && props.d);\n  let b = (props.a && props.b && props.c) || props.d;\n\
  \  return a ? b : props.c;\n}"
tags:
- javascript
title: Logical Expression.Expect
---

## Input

```javascript
function component(props) {
  let a = props.a || (props.b && props.c && props.d);
  let b = (props.a && props.b && props.c) || props.d;
  return a ? b : props.c;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function component(props) {
  const a = props.a || (props.b && props.c && props.d);
  const b = (props.a && props.b && props.c) || props.d;
  return a ? b : props.c;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      