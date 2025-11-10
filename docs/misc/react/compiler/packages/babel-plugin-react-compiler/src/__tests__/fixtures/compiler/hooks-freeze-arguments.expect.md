---
category: misc
last_updated: null
source_file: hooks-freeze-arguments.expect.md
summary: "```javascript\nfunction Component() {\n  const a = [];\n  useFreeze(a);\
  \ // should freeze\n  useFreeze(a); // should be readonly\n  call(a); // should\
  \ be readonly\n  return a;\n}"
tags:
- javascript
title: Hooks Freeze Arguments.Expect
---

## Input

```javascript
function Component() {
  const a = [];
  useFreeze(a); // should freeze
  useFreeze(a); // should be readonly
  call(a); // should be readonly
  return a;
}

function useFreeze(x) {}
function call(x) {}

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
  useFreeze(a);
  useFreeze(a);
  call(a);
  return a;
}

function useFreeze(x) {}
function call(x) {}

```
      