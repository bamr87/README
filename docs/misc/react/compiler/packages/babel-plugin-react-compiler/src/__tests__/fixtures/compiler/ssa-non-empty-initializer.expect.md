---
category: misc
last_updated: null
source_file: ssa-non-empty-initializer.expect.md
summary: "```javascript\nfunction foo(a, b) {\n  let x = [];\n  if (a) {\n    x =\
  \ 1;\n  }"
tags:
- javascript
title: Ssa Non Empty Initializer.Expect
---

## Input

```javascript
function foo(a, b) {
  let x = [];
  if (a) {
    x = 1;
  }

  let y = x;
  return y;
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
function foo(a, b) {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = [];
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  let x = t0;
  if (a) {
    x = 1;
  }

  const y = x;
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      