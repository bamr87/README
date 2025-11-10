---
category: misc
last_updated: null
source_file: frozen-after-alias.expect.md
summary: "```javascript\nfunction Component() {\n  const a = [];\n  const b = a;\n\
  \  useFreeze(a);\n  foo(b); // should be readonly, value is guaranteed frozen via\
  \ alias\n  return b;\n}"
tags:
- javascript
title: Frozen After Alias.Expect
---

## Input

```javascript
function Component() {
  const a = [];
  const b = a;
  useFreeze(a);
  foo(b); // should be readonly, value is guaranteed frozen via alias
  return b;
}

function useFreeze() {}
function foo(x) {}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = [];
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const a = t0;
  const b = a;
  useFreeze(a);
  foo(b);
  return b;
}

function useFreeze() {}
function foo(x) {}

```
      