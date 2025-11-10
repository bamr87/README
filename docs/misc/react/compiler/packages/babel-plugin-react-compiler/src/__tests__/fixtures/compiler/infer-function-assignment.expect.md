---
category: misc
last_updated: null
source_file: infer-function-assignment.expect.md
summary: "```javascript\n// @compilationMode:\"infer\"\nconst Component = props =>\
  \ {\n  return <div />;\n};"
tags:
- javascript
title: Infer Function Assignment.Expect
---

## Input

```javascript
// @compilationMode:"infer"
const Component = props => {
  return <div />;
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @compilationMode:"infer"
const Component = (props) => {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div />;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
};

```
      