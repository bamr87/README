---
category: misc
last_updated: null
source_file: issue933-disjoint-set-infinite-loop.expect.md
summary: "```javascript\nfunction makeObj() {\n  'use no forget';\n  const result\
  \ = [];\n  result.a = {b: 2};"
tags:
- javascript
title: Issue933 Disjoint Set Infinite Loop.Expect
---

## Input

```javascript
function makeObj() {
  'use no forget';
  const result = [];
  result.a = {b: 2};

  return result;
}

// This caused an infinite loop in the compiler
function MyApp(props) {
  const y = makeObj();
  const tmp = y.a;
  const tmp2 = tmp.b;
  y.push(tmp2);
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: MyApp,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function makeObj() {
  "use no forget";
  const result = [];
  result.a = { b: 2 };

  return result;
}

// This caused an infinite loop in the compiler
function MyApp(props) {
  const $ = _c(1);
  let y;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    y = makeObj();
    const tmp = y.a;
    const tmp2 = tmp.b;
    y.push(tmp2);
    $[0] = y;
  } else {
    y = $[0];
  }
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: MyApp,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) [2]