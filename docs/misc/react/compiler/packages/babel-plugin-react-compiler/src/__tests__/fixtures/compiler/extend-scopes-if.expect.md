---
category: misc
last_updated: null
source_file: extend-scopes-if.expect.md
summary: "```javascript\nfunction foo(a, b, c) {\n  let x = [];\n  if (a) {\n    if\
  \ (b) {\n      if (c) {\n        x.push(0);\n      }\n    }\n  }\n  if (x.length)\
  \ {\n    return x;\n  }\n  return null;\n}"
tags:
- javascript
title: Extend Scopes If.Expect
---

## Input

```javascript
function foo(a, b, c) {
  let x = [];
  if (a) {
    if (b) {
      if (c) {
        x.push(0);
      }
    }
  }
  if (x.length) {
    return x;
  }
  return null;
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
  const $ = _c(4);
  let x;
  if ($[0] !== a || $[1] !== b || $[2] !== c) {
    x = [];
    if (a) {
      if (b) {
        if (c) {
          x.push(0);
        }
      }
    }
    $[0] = a;
    $[1] = b;
    $[2] = c;
    $[3] = x;
  } else {
    x = $[3];
  }

  if (x.length) {
    return x;
  }
  return null;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      