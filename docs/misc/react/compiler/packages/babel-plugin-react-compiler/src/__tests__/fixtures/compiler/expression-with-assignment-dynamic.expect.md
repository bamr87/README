---
category: misc
last_updated: null
source_file: expression-with-assignment-dynamic.expect.md
summary: "```javascript\nfunction f(y) {\n  let x = y;\n  return x + (x = 2) + x;\n\
  }"
tags:
- javascript
title: Expression With Assignment Dynamic.Expect
---

## Input

```javascript
function f(y) {
  let x = y;
  return x + (x = 2) + x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: f,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function f(y) {
  let x = y;
  return x + (x = 2) + 2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: f,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      