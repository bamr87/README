---
category: misc
last_updated: null
source_file: alias-nested-member-path.expect.md
summary: "```javascript\nfunction component() {\n  let z = [];\n  let y = {};\n  y.z\
  \ = z;\n  let x = {};\n  x.y = y;\n  return x;\n}"
tags:
- javascript
title: Alias Nested Member Path.Expect
---

## Input

```javascript
function component() {
  let z = [];
  let y = {};
  y.z = z;
  let x = {};
  x.y = y;
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
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const z = [];
    const y = {};
    y.z = z;
    x = {};
    x.y = y;
    $[0] = x;
  } else {
    x = $[0];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) {"y":{"z":[]}}