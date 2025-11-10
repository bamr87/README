---
category: misc
last_updated: null
source_file: prop-capturing-function-1.expect.md
summary: "```javascript\nfunction component(a, b) {\n  let z = {a, b};\n  let x =\
  \ function () {\n    console.log(z);\n  };\n  return x;\n}"
tags:
- javascript
title: Prop Capturing Function 1.Expect
---

## Input

```javascript
function component(a, b) {
  let z = {a, b};
  let x = function () {
    console.log(z);
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
function component(a, b) {
  const $ = _c(3);
  let t0;
  if ($[0] !== a || $[1] !== b) {
    const z = { a, b };
    t0 = function () {
      console.log(z);
    };
    $[0] = a;
    $[1] = b;
    $[2] = t0;
  } else {
    t0 = $[2];
  }
  const x = t0;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      