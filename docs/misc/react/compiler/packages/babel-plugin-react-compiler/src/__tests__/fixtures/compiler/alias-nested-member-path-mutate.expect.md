---
title: Alias Nested Member Path Mutate.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: alias-nested-member-path-mutate.expect.md
---
## Input

```javascript
function component() {
  let z = [];
  let y = {};
  y.z = z;
  let x = {};
  x.y = y;
  mutate(x.y.z);
  return x;
}

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
    mutate(x.y.z);
    $[0] = x;
  } else {
    x = $[0];
  }
  return x;
}

```
      