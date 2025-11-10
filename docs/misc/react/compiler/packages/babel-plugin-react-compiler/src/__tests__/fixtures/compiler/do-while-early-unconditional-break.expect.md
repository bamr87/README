---
title: Do While Early Unconditional Break.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: do-while-early-unconditional-break.expect.md
---
## Input

```javascript
function Component(props) {
  let x = [1, 2, 3];
  do {
    mutate(x);
    break;
  } while (props.cond);
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
    x = [1, 2, 3];

    mutate(x);
    $[0] = x;
  } else {
    x = $[0];
  }
  return x;
}

```
      