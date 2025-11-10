---
category: misc
last_updated: null
source_file: ssa-property-alias-mutate-inside-if.expect.md
summary: "```javascript\nfunction foo(a) {\n  const x = {};\n  if (a) {\n    let y\
  \ = {};\n    x.y = y;\n    mutate(y); // aliases x & y, but not z\n  } else {\n\
  \    let z = {};\n    x.z = z;\n  }\n  return x;\n}"
tags:
- javascript
title: Ssa Property Alias Mutate Inside If.Expect
---

## Input

```javascript
function foo(a) {
  const x = {};
  if (a) {
    let y = {};
    x.y = y;
    mutate(y); // aliases x & y, but not z
  } else {
    let z = {};
    x.z = z;
  }
  return x;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function foo(a) {
  const $ = _c(3);
  let x;
  if ($[0] !== a) {
    x = {};
    if (a) {
      const y = {};
      x.y = y;
      mutate(y);
    } else {
      let t0;
      if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = {};
        $[2] = t0;
      } else {
        t0 = $[2];
      }
      const z = t0;
      x.z = z;
    }
    $[0] = a;
    $[1] = x;
  } else {
    x = $[1];
  }
  return x;
}

```
      