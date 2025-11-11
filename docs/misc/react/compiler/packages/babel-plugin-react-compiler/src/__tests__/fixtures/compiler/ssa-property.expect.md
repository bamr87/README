---
title: Ssa Property.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: ssa-property.expect.md
---
# Ssa Property.Expect

## Input

```javascript
function foo() {
  const x = [];
  const y = {};
  y.x = x;
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function foo() {
  const $ = _c(1);
  let y;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const x = [];
    y = {};
    y.x = x;
    $[0] = y;
  } else {
    y = $[0];
  }
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```

### Eval output
(kind: ok) {"x":[]}