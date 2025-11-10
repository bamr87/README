---
category: misc
last_updated: null
source_file: uninitialized-declaration-in-reactive-scope.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x = mutate();\n  let y;\n\
  \  foo(x);\n  return [y, x];\n}"
tags:
- javascript
title: Uninitialized Declaration In Reactive Scope.Expect
---

## Input

```javascript
function Component(props) {
  let x = mutate();
  let y;
  foo(x);
  return [y, x];
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const x = mutate();
    let y;
    foo(x);
    t0 = [y, x];
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

```
      