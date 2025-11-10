---
category: misc
last_updated: null
source_file: infer-function-expression-component.expect.md
summary: '```javascript

  // @compilationMode:"infer"'
tags:
- javascript
title: Infer Function Expression Component.Expect
---

## Input

```javascript
// @compilationMode:"infer"

const Component = function ComponentName(props) {
  return <Foo />;
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @compilationMode:"infer"

const Component = function ComponentName(props) {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <Foo />;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
};

```
      