---
title: Destructuring Property Inference.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: destructuring-property-inference.expect.md
---
# Destructuring Property Inference.Expect

## Input

```javascript
function Component(props) {
  const x = [];
  x.push(props.value);
  const {length: y} = x;
  foo(y);
  return [x, y];
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(5);
  let x;
  if ($[0] !== props.value) {
    x = [];
    x.push(props.value);
    $[0] = props.value;
    $[1] = x;
  } else {
    x = $[1];
  }
  const { length: y } = x;
  foo(y);
  let t0;
  if ($[2] !== x || $[3] !== y) {
    t0 = [x, y];
    $[2] = x;
    $[3] = y;
    $[4] = t0;
  } else {
    t0 = $[4];
  }
  return t0;
}

```
