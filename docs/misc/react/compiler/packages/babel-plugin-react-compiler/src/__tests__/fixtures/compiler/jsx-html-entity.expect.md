---
category: misc
last_updated: null
source_file: jsx-html-entity.expect.md
summary: "```javascript\nfunction Component() {\n  return <div>&gt;&lt;span &amp;</div>;\n\
  }"
tags:
- javascript
title: Jsx Html Entity.Expect
---

## Input

```javascript
function Component() {
  return <div>&gt;&lt;span &amp;</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div>{"><span &"}</div>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};

```
      
### Eval output
(kind: ok) <div>&gt;&lt;span &amp;</div>