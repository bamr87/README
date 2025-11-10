---
category: misc
last_updated: null
source_file: globals-Number.expect.md
summary: "```javascript\nfunction Component(props) {\n  const x = {};\n  const y =\
  \ Number(x);\n  return [x, y];\n}"
tags:
- javascript
title: Globals Number.Expect
---

## Input

```javascript
function Component(props) {
  const x = {};
  const y = Number(x);
  return [x, y];
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = {};
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const x = t0;
  const y = Number(x);
  let t1;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = [x, y];
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      