---
category: misc
last_updated: null
source_file: for-of-conditional-break.expect.md
summary: "```javascript\nfunction Component() {\n  const x = [];\n  for (const item\
  \ of [1, 2]) {\n    if (item === 1) {\n      break;\n    }\n    x.push(item);\n\
  \  }\n  return x;\n}"
tags:
- javascript
title: For Of Conditional Break.Expect
---

## Input

```javascript
function Component() {
  const x = [];
  for (const item of [1, 2]) {
    if (item === 1) {
      break;
    }
    x.push(item);
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
    for (const item of [1, 2]) {
      if (item === 1) {
        break;
      }

      x.push(item);
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
(kind: ok) []