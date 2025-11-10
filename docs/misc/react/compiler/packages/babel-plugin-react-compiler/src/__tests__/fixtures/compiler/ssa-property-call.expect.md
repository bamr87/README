---
category: misc
last_updated: null
source_file: ssa-property-call.expect.md
summary: "```javascript\nfunction foo() {\n  const x = [];\n  const y = {x: x};\n\
  \  y.x.push([]);\n  return y;\n}"
tags:
- javascript
title: Ssa Property Call.Expect
---

## Input

```javascript
function foo() {
  const x = [];
  const y = {x: x};
  y.x.push([]);
  return y;
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
  let y;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const x = [];
    y = { x };
    y.x.push([]);
    $[0] = y;
  } else {
    y = $[0];
  }
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) {"x":[[]]}