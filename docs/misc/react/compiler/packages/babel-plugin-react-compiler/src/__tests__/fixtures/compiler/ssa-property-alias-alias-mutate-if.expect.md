---
category: misc
last_updated: null
source_file: ssa-property-alias-alias-mutate-if.expect.md
summary: "```javascript\nfunction foo(a) {\n  const b = {};\n  const x = b;\n  if\
  \ (a) {\n    let y = {};\n    x.y = y;\n  } else {\n    let z = {};\n    x.z = z;\n\
  \  }\n  mutate(b); // aliases x, y & z\n  return x;\n}"
tags:
- javascript
title: Ssa Property Alias Alias Mutate If.Expect
---

## Input

```javascript
function foo(a) {
  const b = {};
  const x = b;
  if (a) {
    let y = {};
    x.y = y;
  } else {
    let z = {};
    x.z = z;
  }
  mutate(b); // aliases x, y & z
  return x;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function foo(a) {
  const $ = _c(2);
  let x;
  if ($[0] !== a) {
    const b = {};
    x = b;
    if (a) {
      const y = {};
      x.y = y;
    } else {
      const z = {};
      x.z = z;
    }

    mutate(b);
    $[0] = a;
    $[1] = x;
  } else {
    x = $[1];
  }
  return x;
}

```
      