---
title: Capture Indirect Mutate Alias.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: capture-indirect-mutate-alias.expect.md
---
## Input

```javascript
function component(a) {
  let x = {a};
  const f0 = function () {
    let q = x;
    const f1 = function () {
      q.b = 1;
    };
    f1();
  };
  f0();

  return x;
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
  let x;
  if ($[0] !== a) {
    x = { a };
    const f0 = function () {
      const q = x;
      const f1 = function () {
        q.b = 1;
      };

      f1();
    };

    f0();
    $[0] = a;
    $[1] = x;
  } else {
    x = $[1];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      