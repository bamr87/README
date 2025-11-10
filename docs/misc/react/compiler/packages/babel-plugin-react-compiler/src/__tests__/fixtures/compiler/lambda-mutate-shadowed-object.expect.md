---
category: misc
last_updated: null
source_file: lambda-mutate-shadowed-object.expect.md
summary: "```javascript\nfunction Component() {\n  const x = {};\n  {\n    const x\
  \ = [];\n    const fn = function () {\n      mutate(x);\n    };\n    fn();\n  }\n\
  \  return x; // should return {}\n}"
tags:
- javascript
title: Lambda Mutate Shadowed Object.Expect
---

## Input

```javascript
function Component() {
  const x = {};
  {
    const x = [];
    const fn = function () {
      mutate(x);
    };
    fn();
  }
  return x; // should return {}
}

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

  const x_0 = [];
  const fn = function () {
    mutate(x_0);
  };

  fn();
  return x;
}

```
      