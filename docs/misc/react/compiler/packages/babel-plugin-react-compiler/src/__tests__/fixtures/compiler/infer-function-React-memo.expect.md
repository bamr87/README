---
title: Infer Function React Memo.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: infer-function-React-memo.expect.md
---
# Infer Function React Memo.Expect

## Input

```javascript
// @compilationMode:"infer"
React.memo(props => {
  return <div />;
});

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @compilationMode:"infer"
React.memo((props) => {
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
