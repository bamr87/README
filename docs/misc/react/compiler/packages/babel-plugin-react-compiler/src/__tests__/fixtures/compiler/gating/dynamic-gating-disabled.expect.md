---
title: Dynamic Gating Disabled.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: dynamic-gating-disabled.expect.md
---
## Input

```javascript
// @dynamicGating:{"source":"shared-runtime"}

function Foo() {
  'use memo if(getFalse)';
  return <div>hello world</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
import { getFalse } from "shared-runtime"; // @dynamicGating:{"source":"shared-runtime"}
const Foo = getFalse()
  ? function Foo() {
      "use memo if(getFalse)";
      const $ = _c(1);
      let t0;
      if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = <div>hello world</div>;
        $[0] = t0;
      } else {
        t0 = $[0];
      }
      return t0;
    }
  : function Foo() {
      "use memo if(getFalse)";
      return <div>hello world</div>;
    };

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{}],
};

```
      
### Eval output
(kind: ok) <div>hello world</div>