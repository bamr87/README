---
category: misc
last_updated: null
source_file: call-args-assignment.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x = makeObject();\n  x.foo((x\
  \ = makeObject()));\n  return x;\n}"
tags:
- javascript
title: Call Args Assignment.Expect
---

## Input

```javascript
function Component(props) {
  let x = makeObject();
  x.foo((x = makeObject()));
  return x;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(1);
  let x;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    x = makeObject();
    x.foo((x = makeObject()));
    $[0] = x;
  } else {
    x = $[0];
  }
  return x;
}

```
      