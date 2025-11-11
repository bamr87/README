---
title: Independently Memoize Object Property.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: independently-memoize-object-property.expect.md
---
# Independently Memoize Object Property.Expect

## Input

```javascript
function foo(a, b, c) {
  const x = {a: a};
  // NOTE: this array should memoize independently from x, w only b,c as deps
  x.y = [b, c];

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
import { c as _c } from "react/compiler-runtime";
function foo(a, b, c) {
  const $ = _c(7);
  let x;
  if ($[0] !== a || $[1] !== b || $[2] !== c) {
    x = { a };
    let t0;
    if ($[4] !== b || $[5] !== c) {
      t0 = [b, c];
      $[4] = b;
      $[5] = c;
      $[6] = t0;
    } else {
      t0 = $[6];
    }
    x.y = t0;
    $[0] = a;
    $[1] = b;
    $[2] = c;
    $[3] = x;
  } else {
    x = $[3];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
