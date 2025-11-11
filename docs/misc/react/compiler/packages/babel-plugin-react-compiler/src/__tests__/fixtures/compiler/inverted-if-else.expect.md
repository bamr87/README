---
title: Inverted If Else.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: inverted-if-else.expect.md
---
# Inverted If Else.Expect

## Input

```javascript
function foo(a, b, c) {
  let x = null;
  label: {
    if (a) {
      x = b;
      break label;
    }
    x = c;
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
function foo(a, b, c) {
  let x;
  bb0: {
    if (a) {
      x = b;
      break bb0;
    }

    x = c;
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
