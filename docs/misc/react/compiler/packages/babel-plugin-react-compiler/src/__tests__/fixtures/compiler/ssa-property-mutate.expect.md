---
title: Ssa Property Mutate.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: ssa-property-mutate.expect.md
---
# Ssa Property Mutate.Expect

## Input

```javascript
function foo() {
  const x = [];
  const y = {};
  y.x = x;
  mutate(y);
  return y;
}

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
    mutate(y);
    $[0] = y;
  } else {
    y = $[0];
  }
  return y;
}

```
