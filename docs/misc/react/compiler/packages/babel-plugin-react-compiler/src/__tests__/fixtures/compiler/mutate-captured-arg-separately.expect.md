---
title: Mutate Captured Arg Separately.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: mutate-captured-arg-separately.expect.md
---
## Input

```javascript
function component(a) {
  let y = function () {
    m(x);
  };

  let x = {a};
  m(x);
  return y;
}

function m(x) {}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: [{name: 'Jason'}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function component(a) {
  const $ = _c(2);
  let y;
  if ($[0] !== a) {
    y = function () {
      m(x);
    };

    let x = { a };
    m(x);
    $[0] = a;
    $[1] = y;
  } else {
    y = $[1];
  }
  return y;
}

function m(x) {}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: [{ name: "Jason" }],
};

```
      
### Eval output
(kind: ok) "[[ function params=0 ]]"