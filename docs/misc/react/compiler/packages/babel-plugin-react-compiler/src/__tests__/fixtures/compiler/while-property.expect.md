---
category: misc
last_updated: null
source_file: while-property.expect.md
summary: "```javascript\nfunction foo(a, b) {\n  let x = 0;\n  while (a.b.c) {\n \
  \   x += b;\n  }\n  return x;\n}"
tags:
- javascript
title: While Property.Expect
---

## Input

```javascript
function foo(a, b) {
  let x = 0;
  while (a.b.c) {
    x += b;
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
function foo(a, b) {
  let x = 0;
  while (a.b.c) {
    x = x + b;
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      