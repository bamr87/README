---
category: misc
last_updated: null
source_file: ssa-multiple-phis.expect.md
summary: "```javascript\nfunction foo(a, b, c, d) {\n  let x = 0;\n  if (true) {\n\
  \    if (true) {\n      x = a;\n    } else {\n      x = b;\n    }\n    x;\n  } else\
  \ {\n    if (true) {\n      x = c;\n    } else {\n      x = d..."
tags:
- javascript
title: Ssa Multiple Phis.Expect
---

## Input

```javascript
function foo(a, b, c, d) {
  let x = 0;
  if (true) {
    if (true) {
      x = a;
    } else {
      x = b;
    }
    x;
  } else {
    if (true) {
      x = c;
    } else {
      x = d;
    }
    x;
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
function foo(a, b, c, d) {
  let x;

  x = a;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      