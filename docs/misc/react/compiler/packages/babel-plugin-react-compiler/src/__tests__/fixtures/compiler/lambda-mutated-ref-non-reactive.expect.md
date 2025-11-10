---
category: misc
last_updated: null
source_file: lambda-mutated-ref-non-reactive.expect.md
summary: "``javascript\nfunction f(a) {\n  let x;\n  (() => {\n    x = {};\n  })();\n\
  \  // this is not reactive on x as x` is never reactive\n  return <div x={x} />;\n\
  }"
tags:
- javascript
title: Lambda Mutated Ref Non Reactive.Expect
---

## Input

```javascript
function f(a) {
  let x;
  (() => {
    x = {};
  })();
  // this is not reactive on `x` as `x` is never reactive
  return <div x={x} />;
}

export const FIXTURE_ENTRYPOINT = {
  fn: f,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function f(a) {
  const $ = _c(2);
  let x;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    x = {};
    $[0] = x;
  } else {
    x = $[0];
  }
  let t0;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div x={x} />;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: f,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      