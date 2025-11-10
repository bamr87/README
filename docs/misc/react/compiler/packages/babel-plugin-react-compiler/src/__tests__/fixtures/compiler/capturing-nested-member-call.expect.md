---
category: misc
last_updated: null
source_file: capturing-nested-member-call.expect.md
summary: "```javascript\nfunction component(a) {\n  let z = {a: {a}};\n  let x = function\
  \ () {\n    z.a.a();\n  };\n  return z;\n}"
tags:
- javascript
title: Capturing Nested Member Call.Expect
---

## Input

```javascript
function component(a) {
  let z = {a: {a}};
  let x = function () {
    z.a.a();
  };
  return z;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function component(a) {
  const $ = _c(2);
  let t0;
  if ($[0] !== a) {
    t0 = { a: { a } };
    $[0] = a;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const z = t0;
  return z;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      