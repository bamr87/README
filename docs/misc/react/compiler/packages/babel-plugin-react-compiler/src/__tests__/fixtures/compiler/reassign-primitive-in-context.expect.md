---
category: misc
last_updated: null
source_file: reassign-primitive-in-context.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x = 5;\n  let foo = ()\
  \ => {\n    x = {};\n  };\n  foo();\n  return x;\n}"
tags:
- javascript
title: Reassign Primitive In Context.Expect
---

## Input

```javascript
function Component(props) {
  let x = 5;
  let foo = () => {
    x = {};
  };
  foo();
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(1);
  let x;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    x = 5;
    const foo = () => {
      x = {};
    };

    foo();
    $[0] = x;
  } else {
    x = $[0];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};

```
      
### Eval output
(kind: ok) {}