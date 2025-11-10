---
category: misc
last_updated: null
source_file: ssa-renaming-unconditional-ternary.expect.md
summary: "```javascript\nfunction useFoo(props) {\n  let x = [];\n  x.push(props.bar);\n\
  \  props.cond\n    ? ((x = {}), (x = []), x.push(props.foo))\n    : ((x = []), (x\
  \ = []), x.push(props.bar));\n  return x;\n}"
tags:
- javascript
title: Ssa Renaming Unconditional Ternary.Expect
---

## Input

```javascript
function useFoo(props) {
  let x = [];
  x.push(props.bar);
  props.cond
    ? ((x = {}), (x = []), x.push(props.foo))
    : ((x = []), (x = []), x.push(props.bar));
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{cond: false, foo: 2, bar: 55}],
  sequentialRenders: [
    {cond: false, foo: 2, bar: 55},
    {cond: false, foo: 3, bar: 55},
    {cond: true, foo: 3, bar: 55},
  ],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function useFoo(props) {
  const $ = _c(6);
  let x;
  if ($[0] !== props.bar) {
    x = [];
    x.push(props.bar);
    $[0] = props.bar;
    $[1] = x;
  } else {
    x = $[1];
  }
  if ($[2] !== props.bar || $[3] !== props.cond || $[4] !== props.foo) {
    props.cond ? ((x = []), x.push(props.foo)) : ((x = []), x.push(props.bar));
    $[2] = props.bar;
    $[3] = props.cond;
    $[4] = props.foo;
    $[5] = x;
  } else {
    x = $[5];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{ cond: false, foo: 2, bar: 55 }],
  sequentialRenders: [
    { cond: false, foo: 2, bar: 55 },
    { cond: false, foo: 3, bar: 55 },
    { cond: true, foo: 3, bar: 55 },
  ],
};

```
      
### Eval output
(kind: ok) [55]
[55]
[3]