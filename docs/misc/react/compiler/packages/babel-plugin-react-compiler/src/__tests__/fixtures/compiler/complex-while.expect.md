---
category: misc
last_updated: null
source_file: complex-while.expect.md
summary: "```javascript\nfunction foo(a, b, c) {\n  label: if (a) {\n    while (b)\
  \ {\n      if (c) {\n        break label;\n      }\n    }\n  }\n  return c;\n}"
tags:
- javascript
title: Complex While.Expect
---

## Input

```javascript
function foo(a, b, c) {
  label: if (a) {
    while (b) {
      if (c) {
        break label;
      }
    }
  }
  return c;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function foo(a, b, c) {
  bb0: if (a) {
    while (b) {
      if (c) {
        break bb0;
      }
    }
  }
  return c;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      