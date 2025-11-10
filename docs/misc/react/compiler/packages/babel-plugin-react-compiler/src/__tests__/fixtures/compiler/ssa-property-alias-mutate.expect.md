---
category: misc
last_updated: null
source_file: ssa-property-alias-mutate.expect.md
summary: "```javascript\nfunction foo() {\n  const a = {};\n  const x = a;"
tags:
- javascript
title: Ssa Property Alias Mutate.Expect
---

## Input

```javascript
function foo() {
  const a = {};
  const x = a;

  const y = {};
  y.x = x;

  mutate(a); // y & x are aliased to a
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
    const a = {};
    const x = a;

    y = {};
    y.x = x;

    mutate(a);
    $[0] = y;
  } else {
    y = $[0];
  }
  return y;
}

```
      