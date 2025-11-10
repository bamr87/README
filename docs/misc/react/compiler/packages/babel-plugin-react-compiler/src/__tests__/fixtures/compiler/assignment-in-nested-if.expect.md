---
category: misc
last_updated: null
source_file: assignment-in-nested-if.expect.md
summary: "```javascript\nfunction useBar(props) {\n  let z;"
tags:
- javascript
title: Assignment In Nested If.Expect
---

## Input

```javascript
function useBar(props) {
  let z;

  if (props.a) {
    if (props.b) {
      z = baz();
    }
  }

  return z;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function useBar(props) {
  const $ = _c(1);
  let z;

  if (props.a) {
    if (props.b) {
      let t0;
      if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = baz();
        $[0] = t0;
      } else {
        t0 = $[0];
      }
      z = t0;
    }
  }
  return z;
}

```
      