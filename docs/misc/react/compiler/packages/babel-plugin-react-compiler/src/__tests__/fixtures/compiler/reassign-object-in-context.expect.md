---
category: misc
last_updated: null
source_file: reassign-object-in-context.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x = [];\n  let foo = ()\
  \ => {\n    x = {};\n  };\n  foo();\n  return x;\n}"
tags:
- javascript
title: Reassign Object In Context.Expect
---

## Input

```javascript
function Component(props) {
  let x = [];
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
    x = [];
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
      