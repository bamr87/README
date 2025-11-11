---
title: Return Conditional.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: return-conditional.expect.md
---
# Return Conditional.Expect

## Input

```javascript
function foo(a, b) {
  if (a == null) {
    return null;
  } else {
    return b;
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
function foo(a, b) {
  if (a == null) {
    return null;
  } else {
    return b;
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
