---
category: misc
last_updated: null
source_file: capturing-nested-member-expr.expect.md
summary: "```javascript\nfunction component(a) {\n  let z = {a: {a}};\n  let x = function\
  \ () {\n    console.log(z.a.a);\n  };\n  return x;\n}"
tags:
- javascript
title: Capturing Nested Member Expr.Expect
---

## Input

```javascript
function component(a) {
  let z = {a: {a}};
  let x = function () {
    console.log(z.a.a);
  };
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function component(a) {
  const $ = _c(4);
  let t0;
  if ($[0] !== a) {
    t0 = { a: { a } };
    $[0] = a;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const z = t0;
  let t1;
  if ($[2] !== z.a.a) {
    t1 = function () {
      console.log(z.a.a);
    };
    $[2] = z.a.a;
    $[3] = t1;
  } else {
    t1 = $[3];
  }
  const x = t1;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      