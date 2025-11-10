---
category: misc
last_updated: null
source_file: overlapping-scopes-within-block.expect.md
summary: "```javascript\nfunction foo(a, b, c) {\n  let x = [];\n  if (a) {\n    let\
  \ y = [];\n    if (b) {\n      y.push(c);\n    }"
tags:
- javascript
title: Overlapping Scopes Within Block.Expect
---

## Input

```javascript
function foo(a, b, c) {
  let x = [];
  if (a) {
    let y = [];
    if (b) {
      y.push(c);
    }

    x.push(y);
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function foo(a, b, c) {
  const $ = _c(7);
  let x;
  if ($[0] !== a || $[1] !== b || $[2] !== c) {
    x = [];
    if (a) {
      let y;
      if ($[4] !== b || $[5] !== c) {
        y = [];
        if (b) {
          y.push(c);
        }
        $[4] = b;
        $[5] = c;
        $[6] = y;
      } else {
        y = $[6];
      }

      x.push(y);
    }
    $[0] = a;
    $[1] = b;
    $[2] = c;
    $[3] = x;
  } else {
    x = $[3];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      