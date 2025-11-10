---
category: misc
last_updated: null
source_file: object-method-shorthand.expect.md
summary: "```javascript\nfunction Component() {\n  let obj = {\n    method() {\n \
  \     return 1;\n    },\n  };\n  return obj.method();\n}"
tags:
- javascript
title: Object Method Shorthand.Expect
---

## Input

```javascript
function Component() {
  let obj = {
    method() {
      return 1;
    },
  };
  return obj.method();
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{x: 1}, {a: 2}, {b: 2}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const obj = {
      method() {
        return 1;
      },
    };
    t0 = obj.method();
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ x: 1 }, { a: 2 }, { b: 2 }],
};

```
      
### Eval output
(kind: ok) 1