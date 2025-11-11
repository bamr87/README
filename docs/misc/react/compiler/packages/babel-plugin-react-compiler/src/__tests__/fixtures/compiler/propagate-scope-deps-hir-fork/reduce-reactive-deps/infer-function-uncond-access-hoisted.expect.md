---
title: Infer Function Uncond Access Hoisted.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: infer-function-uncond-access-hoisted.expect.md
---
# Infer Function Uncond Access Hoisted.Expect

## Input

```javascript
// @enablePropagateDepsInHIR

import {Stringify} from 'shared-runtime';

function useFoo({a}) {
  return <Stringify fn={() => a.b.c} shouldInvokeFns={true} />;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{a: null}],
  sequentialRenders: [{a: null}, {a: {b: {c: 4}}}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @enablePropagateDepsInHIR

import { Stringify } from "shared-runtime";

function useFoo(t0) {
  const $ = _c(2);
  const { a } = t0;
  let t1;
  if ($[0] !== a.b.c) {
    t1 = <Stringify fn={() => a.b.c} shouldInvokeFns={true} />;
    $[0] = a.b.c;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{ a: null }],
  sequentialRenders: [{ a: null }, { a: { b: { c: 4 } } }],
};

```

### Eval output
(kind: ok) [[ (exception in render) TypeError: Cannot read properties of null (reading 'b') ]]
<div>{"fn":{"kind":"Function","result":4},"shouldInvokeFns":true}</div>