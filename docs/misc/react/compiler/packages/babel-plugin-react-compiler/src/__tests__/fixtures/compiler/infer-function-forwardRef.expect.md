---
category: misc
last_updated: null
source_file: infer-function-forwardRef.expect.md
summary: "```javascript\n// @compilationMode:\"infer\"\nReact.forwardRef(props =>\
  \ {\n  return <div />;\n});"
tags:
- javascript
title: Infer Function Forwardref.Expect
---

## Input

```javascript
// @compilationMode:"infer"
React.forwardRef(props => {
  return <div />;
});

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @compilationMode:"infer"
React.forwardRef((props) => {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div />;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
});

```
      