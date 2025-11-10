---
category: misc
last_updated: null
source_file: capturing-function-conditional-capture-mutate.expect.md
summary: "``javascript\nfunction useHook(a, b) {\n  let z = {a};\n  let y = b;\n \
  \ let x = function () {\n    if (y) {\n      // we don't know for sure this mutates,\
  \ so we should assume\n      // that there is no mutat..."
tags:
- javascript
title: Capturing Function Conditional Capture Mutate.Expect
---

## Input

```javascript
function useHook(a, b) {
  let z = {a};
  let y = b;
  let x = function () {
    if (y) {
      // we don't know for sure this mutates, so we should assume
      // that there is no mutation so long as `x` isn't called
      // during render
      maybeMutate(z);
    }
  };
  return x;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function useHook(a, b) {
  const $ = _c(5);
  let t0;
  if ($[0] !== a) {
    t0 = { a };
    $[0] = a;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const z = t0;
  const y = b;
  let t1;
  if ($[2] !== y || $[3] !== z) {
    t1 = function () {
      if (y) {
        maybeMutate(z);
      }
    };
    $[2] = y;
    $[3] = z;
    $[4] = t1;
  } else {
    t1 = $[4];
  }
  const x = t1;
  return x;
}

```
      