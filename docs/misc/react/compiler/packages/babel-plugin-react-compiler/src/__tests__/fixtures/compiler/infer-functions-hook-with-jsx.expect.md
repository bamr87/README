---
title: Infer Functions Hook With Jsx.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: infer-functions-hook-with-jsx.expect.md
---
# Infer Functions Hook With Jsx.Expect

## Input

```javascript
// @compilationMode:"infer"
function useDiv(props) {
  return <div />;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @compilationMode:"infer"
function useDiv(props) {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div />;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

```
