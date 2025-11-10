---
category: misc
last_updated: null
source_file: store-via-new.expect.md
summary: "```javascript\nfunction Foo() {\n  const x = {};\n  const y = new Foo(x);\n\
  \  y.mutate();\n  return x;\n}"
tags:
- javascript
title: Store Via New.Expect
---

## Input

```javascript
function Foo() {
  const x = {};
  const y = new Foo(x);
  y.mutate();
  return x;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Foo() {
  const $ = _c(1);
  let x;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    x = {};
    const y = new Foo(x);
    y.mutate();
    $[0] = x;
  } else {
    x = $[0];
  }
  return x;
}

```
      