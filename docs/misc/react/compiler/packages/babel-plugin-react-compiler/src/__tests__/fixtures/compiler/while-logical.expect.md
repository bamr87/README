---
category: misc
last_updated: null
source_file: while-logical.expect.md
summary: "```javascript\nfunction foo(props) {\n  let x = 0;\n  while (x > props.min\
  \ && x < props.max) {\n    x = 2;\n  }\n  return x;\n}"
tags:
- javascript
title: While Logical.Expect
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
      