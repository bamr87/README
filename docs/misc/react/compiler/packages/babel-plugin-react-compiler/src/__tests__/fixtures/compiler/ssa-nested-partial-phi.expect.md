---
category: misc
last_updated: null
source_file: ssa-nested-partial-phi.expect.md
summary: "```javascript\nfunction foo(a, b, c) {\n  let x = a;\n  if (b) {\n    if\
  \ (c) {\n      x = c;\n    }\n    // TODO: move the return to the end of the function\n\
  \    return x;\n  }\n}"
tags:
- javascript
title: Ssa Nested Partial Phi.Expect
---

## Input

```javascript
function foo(a, b, c) {
  let x = a;
  if (b) {
    if (c) {
      x = c;
    }
    // TODO: move the return to the end of the function
    return x;
  }
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
  let x = a;
  if (b) {
    if (c) {
      x = c;
    }
    return x;
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      