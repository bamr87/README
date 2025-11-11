---
title: Type Test Return Type Inference.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: type-test-return-type-inference.expect.md
---
# Type Test Return Type Inference.Expect

## Input

```javascript
function component() {
  let x = foo();
  let y = foo();
  if (x > y) {
    let z = {};
  }

  let z = foo();
  return z;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function component() {
  const $ = _c(1);
  const x = foo();
  const y = foo();
  if (x > y) {
  }
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = foo();
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const z_0 = t0;
  return z_0;
}

```
