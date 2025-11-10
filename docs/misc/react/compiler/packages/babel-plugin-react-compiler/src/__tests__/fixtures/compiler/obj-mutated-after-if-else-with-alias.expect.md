---
category: misc
last_updated: null
source_file: obj-mutated-after-if-else-with-alias.expect.md
summary: "```javascript\nfunction foo(a, b, c, d) {\n  let x = someObj();\n  if (a)\
  \ {\n    const y = someObj();\n    const z = y;\n    x = z;\n  } else {\n    x =\
  \ someObj();\n  }"
tags:
- javascript
title: Obj Mutated After If Else With Alias.Expect
---

## Input

```javascript
function foo(a, b, c, d) {
  let x = someObj();
  if (a) {
    const y = someObj();
    const z = y;
    x = z;
  } else {
    x = someObj();
  }

  x.f = 1;
  return x;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function foo(a, b, c, d) {
  const $ = _c(2);
  someObj();
  let x;
  if ($[0] !== a) {
    if (a) {
      const y = someObj();
      const z = y;
      x = z;
    } else {
      x = someObj();
    }

    x.f = 1;
    $[0] = a;
    $[1] = x;
  } else {
    x = $[1];
  }
  return x;
}

```
      