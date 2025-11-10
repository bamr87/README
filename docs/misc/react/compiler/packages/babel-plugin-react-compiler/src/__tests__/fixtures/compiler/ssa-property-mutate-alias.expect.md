---
category: misc
last_updated: null
source_file: ssa-property-mutate-alias.expect.md
summary: "```javascript\nfunction foo() {\n  const a = {};\n  const y = a;\n  const\
  \ x = [];"
tags:
- javascript
title: Ssa Property Mutate Alias.Expect
---

## Input

```javascript
function foo() {
  const a = {};
  const y = a;
  const x = [];

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
    y = a;
    const x = [];

    y.x = x;

    mutate(a);
    $[0] = y;
  } else {
    y = $[0];
  }
  return y;
}

```
      