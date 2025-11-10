---
category: misc
last_updated: null
source_file: capture_mutate-across-fns.expect.md
summary: "```javascript\nfunction component(a) {\n  let z = {a};\n  const f0 = function\
  \ () {\n    const f1 = function () {\n      z.b = 1;\n    };\n    f1();\n  };\n\
  \  f0();\n  return z;\n}"
tags:
- javascript
title: Capture Mutate Across Fns.Expect
---

## Input

```javascript
function component(a) {
  let z = {a};
  const f0 = function () {
    const f1 = function () {
      z.b = 1;
    };
    f1();
  };
  f0();
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
function component(a) {
  const $ = _c(2);
  let z;
  if ($[0] !== a) {
    z = { a };
    const f0 = function () {
      const f1 = function () {
        z.b = 1;
      };

      f1();
    };

    f0();
    $[0] = a;
    $[1] = z;
  } else {
    z = $[1];
  }
  return z;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      