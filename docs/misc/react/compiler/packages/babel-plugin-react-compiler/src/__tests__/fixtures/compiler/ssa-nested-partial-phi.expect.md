---
title: Ssa Nested Partial Phi.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: ssa-nested-partial-phi.expect.md
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
      