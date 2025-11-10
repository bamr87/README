---
category: misc
last_updated: null
source_file: immutable-hooks.expect.md
summary: "```javascript\n// @enableAssumeHooksFollowRulesOfReact true\nfunction Component(props)\
  \ {\n  const x = {};\n  // In enableAssumeHooksFollowRulesOfReact mode hooks freeze\
  \ their inputs and return frozen valu..."
tags:
- javascript
title: Immutable Hooks.Expect
---

## Input

```javascript
// @enableAssumeHooksFollowRulesOfReact true
function Component(props) {
  const x = {};
  // In enableAssumeHooksFollowRulesOfReact mode hooks freeze their inputs and return frozen values
  const y = useFoo(x);
  // Thus both x and y are frozen here, and x can be independently memoized
  bar(x, y);
  return [x, y];
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @enableAssumeHooksFollowRulesOfReact true
function Component(props) {
  const $ = _c(3);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = {};
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const x = t0;

  const y = useFoo(x);

  bar(x, y);
  let t1;
  if ($[1] !== y) {
    t1 = [x, y];
    $[1] = y;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  return t1;
}

```
      