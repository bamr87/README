---
category: misc
last_updated: null
source_file: store-via-call.expect.md
summary: "```javascript\nfunction foo() {\n  const x = {};\n  const y = foo(x);\n\
  \  y.mutate();\n  return x;\n}"
tags:
- javascript
title: Store Via Call.Expect
---

## Input

```javascript
function foo() {
  const x = {};
  const y = foo(x);
  y.mutate();
  return x;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function foo() {
  const $ = _c(1);
  let x;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    x = {};
    const y = foo(x);
    y.mutate();
    $[0] = x;
  } else {
    x = $[0];
  }
  return x;
}

```
      