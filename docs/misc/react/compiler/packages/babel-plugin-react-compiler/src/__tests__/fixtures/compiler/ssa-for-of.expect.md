---
category: misc
last_updated: null
source_file: ssa-for-of.expect.md
summary: "```javascript\nfunction foo(cond) {\n  let items = [];\n  for (const item\
  \ of items) {\n    let y = 0;\n    if (cond) {\n      y = 1;\n    }\n  }\n  return\
  \ items;\n}"
tags:
- javascript
title: Ssa For Of.Expect
---

## Input

```javascript
function foo(cond) {
  let items = [];
  for (const item of items) {
    let y = 0;
    if (cond) {
      y = 1;
    }
  }
  return items;
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
function foo(cond) {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = [];
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const items = t0;
  for (const item of items) {
    if (cond) {
    }
  }
  return items;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      