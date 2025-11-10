---
category: misc
last_updated: null
source_file: ssa-nested-partial-reassignment.expect.md
summary: "```javascript\nfunction foo(a, b, c, d, e) {\n  let x = null;\n  if (a)\
  \ {\n    x = b;\n  } else {\n    if (c) {\n      x = d;\n    }\n  }\n  return x;\n\
  }"
tags:
- javascript
title: Ssa Nested Partial Reassignment.Expect
---

## Input

```javascript
function foo(a, b, c, d, e) {
  let x = null;
  if (a) {
    x = b;
  } else {
    if (c) {
      x = d;
    }
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
function foo(a, b, c, d, e) {
  let x = null;
  if (a) {
    x = b;
  } else {
    if (c) {
      x = d;
    }
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      