---
title: Destructure String Literal Property Key.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: destructure-string-literal-property-key.expect.md
---
# Destructure String Literal Property Key.Expect

## Input

```javascript
function foo() {
  const {data: t} = {data: 1};
  return t;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function foo() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = { data: 1 };
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const { data: t } = t0;
  return t;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```

### Eval output
(kind: ok) 1