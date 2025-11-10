---
category: misc
last_updated: null
source_file: hoisting-repro-variable-used-in-assignment.expect.md
summary: "```javascript\nfunction get2() {\n  const callbk = () => {\n    const copy\
  \ = x;\n    return copy;\n  };\n  const x = 2;\n  return callbk();\n}"
tags:
- javascript
title: Hoisting Repro Variable Used In Assignment.Expect
---

## Input

```javascript
function get2() {
  const callbk = () => {
    const copy = x;
    return copy;
  };
  const x = 2;
  return callbk();
}

export const FIXTURE_ENTRYPOINT = {
  fn: get2,
  params: [],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function get2() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const callbk = () => {
      const copy = x;
      return copy;
    };

    const x = 2;
    t0 = callbk();
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: get2,
  params: [],
};

```
      
### Eval output
(kind: ok) 2