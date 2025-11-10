---
category: misc
last_updated: null
source_file: array-map-mutable-array-non-mutating-lambda-mutated-result.expect.md
summary: "```javascript\nfunction Component(props) {\n  const x = [{}];\n  const y\
  \ = x.map(item => {\n    return item;\n  });\n  y[0].flag = true;\n  return [x,\
  \ y];\n}"
tags:
- javascript
title: Array Map Mutable Array Non Mutating Lambda Mutated Result.Expect
---

## Input

```javascript
function Component(props) {
  const x = [{}];
  const y = x.map(item => {
    return item;
  });
  y[0].flag = true;
  return [x, y];
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
  isComponent: false,
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const x = [{}];
    const y = x.map(_temp);
    y[0].flag = true;
    t0 = [x, y];
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}
function _temp(item) {
  return item;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) [[{"flag":true}],["[[ cyclic ref *2 ]]"]]