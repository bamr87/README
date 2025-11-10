---
category: misc
last_updated: null
source_file: simple-alias.expect.md
summary: "```javascript\nfunction mutate() {}\nfunction foo() {\n  let a = {};\n \
  \ let b = {};\n  let c = {};\n  a = b;\n  b = c;\n  c = a;\n  mutate(a, b);\n  return\
  \ c;\n}"
tags:
- javascript
title: Simple Alias.Expect
---

## Input

```javascript
function mutate() {}
function foo() {
  let a = {};
  let b = {};
  let c = {};
  a = b;
  b = c;
  c = a;
  mutate(a, b);
  return c;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function mutate() {}
function foo() {
  const $ = _c(2);
  let a;
  let c;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    let b = {};
    c = {};
    a = b;
    b = c;
    c = a;
    mutate(a, b);
    $[0] = c;
    $[1] = a;
  } else {
    c = $[0];
    a = $[1];
  }
  return c;
}

```
      