---
category: misc
last_updated: null
source_file: reactive-control-dependency-if.expect.md
summary: "``javascript\nfunction Component(props) {\n  let x;\n  if (props.cond) {\n\
  \    x = 1;\n  } else {\n    x = 2;\n  }\n  // The values assigned to x are nonreactive,\
  \ but the value of x\n  // depends on the \"contro..."
tags:
- javascript
title: Reactive Control Dependency If.Expect
---

## Input

```javascript
function Component(props) {
  let x;
  if (props.cond) {
    x = 1;
  } else {
    x = 2;
  }
  // The values assigned to `x` are non-reactive, but the value of `x`
  // depends on the "control" value `props.cond` which is reactive.
  // Therefore x should be treated as reactive too.
  return [x];
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  sequentialRenders: [
    {cond: true},
    {cond: true},
    {cond: false},
    {cond: false},
    {cond: true},
    {cond: false},
    {cond: true},
    {cond: false},
  ],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  let x;
  if (props.cond) {
    x = 1;
  } else {
    x = 2;
  }
  let t0;
  if ($[0] !== x) {
    t0 = [x];
    $[0] = x;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  sequentialRenders: [
    { cond: true },
    { cond: true },
    { cond: false },
    { cond: false },
    { cond: true },
    { cond: false },
    { cond: true },
    { cond: false },
  ],
};

```
      
### Eval output
(kind: ok) [1]
[1]
[2]
[2]
[1]
[2]
[1]
[2]