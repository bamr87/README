---
category: misc
last_updated: null
source_file: destructure-mixed-property-key-types.expect.md
summary: "```javascript\nfunction foo() {\n  const {'datafoobar': x, a: y, data: z}\
  \ = {'datafoobar': 1, a: 2, data: 3};\n  return [x, y, z];\n}"
tags:
- javascript
title: Destructure Mixed Property Key Types.Expect
---

## Input

```javascript
function foo() {
  const {'data-foo-bar': x, a: y, data: z} = {'data-foo-bar': 1, a: 2, data: 3};
  return [x, y, z];
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
  const $ = _c(2);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = { "data-foo-bar": 1, a: 2, data: 3 };
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const { "data-foo-bar": x, a: y, data: z } = t0;
  let t1;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = [x, y, z];
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) [1,2,3]