---
category: misc
last_updated: null
source_file: function-declaration-reassign.expect.md
summary: "```javascript\nfunction component() {\n  function x(a) {\n    a.foo();\n\
  \  }\n  x = {};\n  return x;\n}"
tags:
- javascript
title: Function Declaration Reassign.Expect
---

## Input

```javascript
function component() {
  function x(a) {
    a.foo();
  }
  x = {};
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function component() {
  const $ = _c(1);
  let x;
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = {};
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  x = t0;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) {}