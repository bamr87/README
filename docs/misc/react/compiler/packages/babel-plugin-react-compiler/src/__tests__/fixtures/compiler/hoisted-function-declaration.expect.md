---
title: Hoisted Function Declaration.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: hoisted-function-declaration.expect.md
---
# Hoisted Function Declaration.Expect

## Input

```javascript
function component(a) {
  let t = {a};
  x(t); // hoisted call
  function x(p) {
    p.a.foo();
  }
  return t;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: [
    {
      foo: () => {
        console.log(42);
      },
    },
  ],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function component(a) {
  const $ = _c(2);
  let t;
  if ($[0] !== a) {
    t = { a };
    x(t);
    function x(p) {
      p.a.foo();
    }
    $[0] = a;
    $[1] = t;
  } else {
    t = $[1];
  }
  return t;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: [
    {
      foo: () => {
        console.log(42);
      },
    },
  ],
};

```

### Eval output
(kind: ok) {"a":{"foo":"[[ function params=0 ]]"}}
logs: [42]