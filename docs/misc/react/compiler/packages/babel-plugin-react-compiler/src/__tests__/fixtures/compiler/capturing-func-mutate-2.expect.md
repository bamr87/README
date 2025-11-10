---
category: misc
last_updated: null
source_file: capturing-func-mutate-2.expect.md
summary: "```javascript\nfunction component(a, b) {\n  let y = {b};\n  let z = {a};\n\
  \  let x = function () {\n    z.a = 2;\n    y.b;\n  };\n  x();\n  return z;\n}"
tags:
- javascript
title: Capturing Func Mutate 2.Expect
---

## Input

```javascript
function component(a, b) {
  let y = {b};
  let z = {a};
  let x = function () {
    z.a = 2;
    y.b;
  };
  x();
  return z;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: [{a: 'val1', b: 'val2'}],
  isComponent: false,
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function component(a, b) {
  const $ = _c(2);
  let z;
  if ($[0] !== a) {
    z = { a };
    const x = function () {
      z.a = 2;
    };

    x();
    $[0] = a;
    $[1] = z;
  } else {
    z = $[1];
  }
  return z;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: [{ a: "val1", b: "val2" }],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) {"a":2}