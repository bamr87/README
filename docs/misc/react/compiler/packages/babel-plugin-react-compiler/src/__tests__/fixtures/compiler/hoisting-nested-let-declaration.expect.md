---
category: misc
last_updated: null
source_file: hoisting-nested-let-declaration.expect.md
summary: "```javascript\nfunction hoisting() {\n  let qux = () => {\n    let result;\n\
  \    {\n      result = foo();\n    }\n    return result;\n  };\n  let foo = () =>\
  \ {\n    return bar + baz;\n  };\n  let bar = 3;\n  const ..."
tags:
- javascript
title: Hoisting Nested Let Declaration.Expect
---

## Input

```javascript
function hoisting() {
  let qux = () => {
    let result;
    {
      result = foo();
    }
    return result;
  };
  let foo = () => {
    return bar + baz;
  };
  let bar = 3;
  const baz = 2;
  return qux(); // OK: called outside of TDZ
}

export const FIXTURE_ENTRYPOINT = {
  fn: hoisting,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function hoisting() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const qux = () => {
      let result;

      result = foo();
      return result;
    };

    let foo = () => bar + baz;

    let bar = 3;
    const baz = 2;
    t0 = qux();
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: hoisting,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) 5