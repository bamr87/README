---
category: misc
last_updated: null
source_file: optional-member-expression-with-optional-member-expr-as-property.expect.md
summary: "```javascript\nfunction Component(props) {\n  const x = makeObject();\n\
  \  return x.y?.[props.a?.[props.b?.[props.c]]];\n}"
tags:
- javascript
title: Optional Member Expression With Optional Member Expr As Property.Expect
---

## Input

```javascript
function Component(props) {
  const x = makeObject();
  return x.y?.[props.a?.[props.b?.[props.c]]];
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = makeObject();
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const x = t0;
  return x.y?.[props.a?.[props.b?.[props.c]]];
}

```
      