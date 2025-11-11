---
title: Tagged Template Literal.Expect
category: api
tags:
- javascript
- api
last_updated: null
source_file: tagged-template-literal.expect.md
---
# Tagged Template Literal.Expect

## Input

```javascript
function component() {
  let t = graphql`
    fragment F on T {
      id
    }
  `;

  return t;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function component() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = graphql`
      fragment F on T {
        id
      }
    `;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const t = t0;
  return t;
}

```
