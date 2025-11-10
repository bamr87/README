---
category: misc
last_updated: null
source_file: for-logical.expect.md
summary: "```javascript\nfunction foo(props) {\n  let y = 0;\n  for (\n    let x =\
  \ 0;\n    x > props.min && x < props.max;\n    x += props.cond ? props.increment\
  \ : 2\n  ) {\n    x = 2;\n    y += x;\n  }\n  return y;\n}"
tags:
- javascript
title: For Logical.Expect
---

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
      