---
category: misc
last_updated: null
source_file: lambda-reassign-shadowed-primitive.expect.md
summary: "```javascript\nfunction Component() {\n  const x = {};\n  {\n    let x =\
  \ 56;\n    const fn = function () {\n      x = 42;\n    };\n    fn();\n  }\n  return\
  \ x; // should return {}\n}"
tags:
- javascript
title: Lambda Reassign Shadowed Primitive.Expect
---

## Input

```javascript
function Component() {
  const x = {};
  {
    let x = 56;
    const fn = function () {
      x = 42;
    };
    fn();
  }
  return x; // should return {}
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = {};
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const x = t0;

  let x_0 = 56;
  const fn = function () {
    x_0 = 42;
  };

  fn();
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) {}