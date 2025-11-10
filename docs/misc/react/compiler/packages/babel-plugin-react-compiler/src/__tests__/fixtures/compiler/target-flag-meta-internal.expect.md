---
category: misc
last_updated: null
source_file: target-flag-meta-internal.expect.md
summary: '```javascript

  // @target="donotusemetainternal"'
tags:
- javascript
title: Target Flag Meta Internal.Expect
---

## Input

```javascript
// @target="donotuse_meta_internal"

function Component() {
  return <div>Hello world</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  isComponent: true,
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @target="donotuse_meta_internal"

function Component() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div>Hello world</div>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  isComponent: true,
};

```
      