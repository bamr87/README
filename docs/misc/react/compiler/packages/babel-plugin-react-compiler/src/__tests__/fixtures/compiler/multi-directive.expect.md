---
category: misc
last_updated: null
source_file: multi-directive.expect.md
summary: "```javascript\nfunction Component() {\n  'use foo';\n  'use bar';\n  return\
  \ <div>\"foo\"</div>;\n}"
tags:
- javascript
title: Multi Directive.Expect
---

## Input

```javascript
function Component() {
  'use foo';
  'use bar';
  return <div>"foo"</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  isComponent: true,
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component() {
  "use foo";
  "use bar";
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div>"foo"</div>;
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
      
### Eval output
(kind: ok) <div>"foo"</div>