---
category: misc
last_updated: null
source_file: update-expression-on-function-parameter-1.expect.md
summary: "```javascript\nfunction Component({a: a, b: [b], c: {c}}) {\n  let d = a++;\n\
  \  let e = ++a;\n  let f = b;\n  let g = b;\n  let h = c++;\n  let i = c;\n  return\
  \ [a, b, c, d, e, f, g, h, i];\n}"
tags:
- javascript
title: Update Expression On Function Parameter 1.Expect
---

## Input

```javascript
function Component({a: a, b: [b], c: {c}}) {
  let d = a++;
  let e = ++a;
  let f = b--;
  let g = --b;
  let h = c++;
  let i = --c;
  return [a, b, c, d, e, f, g, h, i];
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{a: 2, b: [3], c: {c: 4}}],
  isComponent: false,
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(t0) {
  const $ = _c(10);
  let { a, b: t1, c: t2 } = t0;
  let [b] = t1;
  let { c } = t2;
  const d = a++;
  const e = ++a;
  const f = b--;
  const g = --b;
  const h = c++;
  const i = --c;
  let t3;
  if (
    $[0] !== a ||
    $[1] !== b ||
    $[2] !== c ||
    $[3] !== d ||
    $[4] !== e ||
    $[5] !== f ||
    $[6] !== g ||
    $[7] !== h ||
    $[8] !== i
  ) {
    t3 = [a, b, c, d, e, f, g, h, i];
    $[0] = a;
    $[1] = b;
    $[2] = c;
    $[3] = d;
    $[4] = e;
    $[5] = f;
    $[6] = g;
    $[7] = h;
    $[8] = i;
    $[9] = t3;
  } else {
    t3 = $[9];
  }
  return t3;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ a: 2, b: [3], c: { c: 4 } }],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) [4,1,4,2,4,3,1,4,4]