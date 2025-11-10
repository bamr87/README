---
title: Memoize Value Block Value Sequence.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: memoize-value-block-value-sequence.expect.md
---
## Input

```javascript
function Foo(props) {
  let x;
  (x = []), null;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Foo(props) {
  const $ = _c(1);
  let x;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    (x = []), null;
    $[0] = x;
  } else {
    x = $[0];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{}],
};

```
      
### Eval output
(kind: ok) []