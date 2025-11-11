---
title: While Conditional Continue.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: while-conditional-continue.expect.md
---
# While Conditional Continue.Expect

## Input

```javascript
function foo(a, b, c, d) {
  while (a) {
    if (b) {
      continue;
    }
    c();
    continue;
  }
  d();
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
  while (a) {
    if (b) {
      continue;
    }

    c();
  }

  d();
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
