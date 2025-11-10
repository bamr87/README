---
category: misc
last_updated: null
source_file: for-of-simple.expect.md
summary: "```javascript\nfunction Component() {\n  let x = [];\n  let items = [0,\
  \ 1, 2];\n  for (const ii of items) {\n    x.push(ii  2);\n  }\n  return x;\n}"
tags:
- javascript
title: For Of Simple.Expect
---

## Input

```javascript
function Component() {
  let x = [];
  let items = [0, 1, 2];
  for (const ii of items) {
    x.push(ii * 2);
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component() {
  const $ = _c(1);
  let x;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    x = [];
    const items = [0, 1, 2];
    for (const ii of items) {
      x.push(ii * 2);
    }
    $[0] = x;
  } else {
    x = $[0];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) [0,2,4]