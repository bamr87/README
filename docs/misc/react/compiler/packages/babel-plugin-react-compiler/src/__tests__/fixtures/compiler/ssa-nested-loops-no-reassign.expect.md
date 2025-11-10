---
category: misc
last_updated: null
source_file: ssa-nested-loops-no-reassign.expect.md
summary: "```javascript\n// @xonly\nfunction foo(a, b, c) {\n  let x = 0;\n  while\
  \ (a) {\n    while (b) {\n      while (c) {\n        x + 1;\n      }\n    }\n  }\n\
  \  return x;\n}"
tags:
- javascript
title: Ssa Nested Loops No Reassign.Expect
---

## Input

```javascript
// @xonly
function foo(a, b, c) {
  let x = 0;
  while (a) {
    while (b) {
      while (c) {
        x + 1;
      }
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
// @xonly
function foo(a, b, c) {
  while (a) {
    while (b) {
      while (c) {}
    }
  }
  return 0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      