---
category: misc
last_updated: null
source_file: capturing-function-within-block.expect.md
summary: "```javascript\nfunction component(a) {\n  let z = {a};\n  let x;\n  {\n\
  \    x = function () {\n      console.log(z);\n    };\n  }\n  return x;\n}"
tags:
- javascript
title: Capturing Function Within Block.Expect
---

## Input

```javascript
function component(a) {
  let z = {a};
  let x;
  {
    x = function () {
      console.log(z);
    };
  }
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
    t0 = { a };
    $[0] = a;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const z = t0;
  let x;
  let t1;
  if ($[2] !== z) {
    t1 = function () {
      console.log(z);
    };
    $[2] = z;
    $[3] = t1;
  } else {
    t1 = $[3];
  }
  x = t1;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      