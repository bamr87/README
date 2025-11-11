---
title: Capturing Nested Member Call.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: capturing-nested-member-call.expect.md
---
# Capturing Nested Member Call.Expect

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
