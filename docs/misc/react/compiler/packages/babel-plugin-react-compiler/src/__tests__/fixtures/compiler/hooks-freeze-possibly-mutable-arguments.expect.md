---
category: misc
last_updated: null
source_file: hooks-freeze-possibly-mutable-arguments.expect.md
summary: "```javascript\nfunction Component(props) {\n  const cond = props.cond;\n\
  \  const x = props.x;\n  let a;\n  if (cond) {\n    a = x;\n  } else {\n    a =\
  \ [];\n  }\n  useFreeze(a); // should freeze, value may be mu..."
tags:
- javascript
title: Hooks Freeze Possibly Mutable Arguments.Expect
---

## Input

```javascript
function Component(props) {
  const cond = props.cond;
  const x = props.x;
  let a;
  if (cond) {
    a = x;
  } else {
    a = [];
  }
  useFreeze(a); // should freeze, value *may* be mutable
  useFreeze(a); // should be readonly
  call(a); // should be readonly
  return a;
}

function useFreeze(x) {}
function call(x) {}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(1);
  const cond = props.cond;
  const x = props.x;
  let a;
  if (cond) {
    a = x;
  } else {
    let t0;
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
      t0 = [];
      $[0] = t0;
    } else {
      t0 = $[0];
    }
    a = t0;
  }

  useFreeze(a);
  useFreeze(a);
  call(a);
  return a;
}

function useFreeze(x) {}
function call(x) {}

```
      