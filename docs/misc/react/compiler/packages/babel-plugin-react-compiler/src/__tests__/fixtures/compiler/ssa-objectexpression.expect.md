---
category: misc
last_updated: null
source_file: ssa-objectexpression.expect.md
summary: "```javascript\nfunction Component(props) {\n  const a = 1;\n  const b =\
  \ 2;\n  const x = {a: a, b: b};\n  return x;\n}"
tags:
- javascript
title: Ssa Objectexpression.Expect
---

## Input

```javascript
function Component(props) {
  const a = 1;
  const b = 2;
  const x = {a: a, b: b};
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = { a: 1, b: 2 };
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const x = t0;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      