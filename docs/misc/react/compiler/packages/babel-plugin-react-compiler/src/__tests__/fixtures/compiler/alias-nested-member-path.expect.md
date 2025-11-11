---
title: Alias Nested Member Path.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: alias-nested-member-path.expect.md
---
# Alias Nested Member Path.Expect

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