---
category: misc
last_updated: null
source_file: capturing-func-mutate-3.expect.md
summary: "```javascript\nfunction component(a, b) {\n  let y = {b};\n  let z = {a};\n\
  \  let x = function () {\n    z.a = 2;\n    y.b;\n  };\n  return z;\n}"
tags:
- javascript
title: Capturing Func Mutate 3.Expect
---

## Input

```javascript
function component(a, b) {
  let y = {b};
  let z = {a};
  let x = function () {
    z.a = 2;
    y.b;
  };
  return z;
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
  const $ = _c(2);
  let t0;
  if ($[0] !== a) {
    t0 = { a };
    $[0] = a;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const z = t0;
  return z;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      