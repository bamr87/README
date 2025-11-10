---
category: misc
last_updated: null
source_file: useMemo-arrow-implicit-return.expect.md
summary: "```javascript\n// @validateNoVoidUseMemo\nfunction Component() {\n  const\
  \ value = useMemo(() => computeValue(), []);\n  return <div>{value}</div>;\n}"
tags:
- javascript
title: Usememo Arrow Implicit Return.Expect
---

## Input

```javascript
// @validateNoVoidUseMemo
function Component() {
  const value = useMemo(() => computeValue(), []);
  return <div>{value}</div>;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @validateNoVoidUseMemo
function Component() {
  const $ = _c(2);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = computeValue();
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const value = t0;
  let t1;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = <div>{value}</div>;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

```
      
### Eval output
(kind: exception) Fixture not implemented