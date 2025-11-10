---
category: misc
last_updated: null
source_file: alias-while.expect.md
summary: "```javascript\nfunction foo(cond) {\n  let a = {};\n  let b = {};\n  let\
  \ c = {};\n  while (cond) {\n    let z = a;\n    a = b;\n    b = c;\n    c = z;\n\
  \    mutate(a, b);\n  }\n  a;\n  b;\n  c;\n  return a;\n}"
tags:
- javascript
title: Alias While.Expect
---

## Input

```javascript
function foo(cond) {
  let a = {};
  let b = {};
  let c = {};
  while (cond) {
    let z = a;
    a = b;
    b = c;
    c = z;
    mutate(a, b);
  }
  a;
  b;
  c;
  return a;
}

function mutate(x, y) {}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function foo(cond) {
  const $ = _c(2);
  let a;
  if ($[0] !== cond) {
    a = {};
    let b = {};
    let c = {};
    while (cond) {
      const z = a;
      a = b;
      b = c;
      c = z;
      mutate(a, b);
    }
    $[0] = cond;
    $[1] = a;
  } else {
    a = $[1];
  }
  return a;
}

function mutate(x, y) {}

```
      