---
category: misc
last_updated: null
source_file: reactive-scopes.expect.md
summary: "```javascript\nfunction f(a, b) {\n  let x = []; // < x starts being mutable\
  \ here.\n  if (a.length === 1) {\n    if (b) {\n      x.push(b); // < x stops being\
  \ mutable here.\n    }\n  }"
tags:
- javascript
title: Reactive Scopes.Expect
---

## Input

```javascript
function f(a, b) {
  let x = []; // <- x starts being mutable here.
  if (a.length === 1) {
    if (b) {
      x.push(b); // <- x stops being mutable here.
    }
  }

  return <div>{x}</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: f,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function f(a, b) {
  const $ = _c(3);
  let t0;
  if ($[0] !== a.length || $[1] !== b) {
    const x = [];
    if (a.length === 1) {
      if (b) {
        x.push(b);
      }
    }

    t0 = <div>{x}</div>;
    $[0] = a.length;
    $[1] = b;
    $[2] = t0;
  } else {
    t0 = $[2];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: f,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      