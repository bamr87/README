---
category: misc
last_updated: null
source_file: jump-target-within-scope-label.expect.md
summary: "```javascript\nfunction useFoo({input, cond}) {\n  const x = [];\n  label:\
  \ {\n    if (cond) {\n      break label;\n    }\n  }\n  x.push(input.a.b); // unconditional\n\
  \  return x;\n}"
tags:
- javascript
title: Jump Target Within Scope Label.Expect
---

## Input

```javascript
function useFoo({input, cond}) {
  const x = [];
  label: {
    if (cond) {
      break label;
    }
  }
  x.push(input.a.b); // unconditional
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{input: {a: {b: 2}}, cond: false}],
  sequentialRenders: [
    {input: {a: {b: 2}}, cond: false},
    // preserve nullthrows
    {input: null, cond: false},
    {input: null, cond: true},
    {input: {}, cond: false},
    {input: {a: {b: null}}, cond: false},
    {input: {a: null}, cond: false},
    {input: {a: {b: 3}}, cond: false},
  ],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function useFoo(t0) {
  const $ = _c(3);
  const { input, cond } = t0;
  let x;
  if ($[0] !== cond || $[1] !== input.a.b) {
    x = [];
    bb0: if (cond) {
      break bb0;
    }

    x.push(input.a.b);
    $[0] = cond;
    $[1] = input.a.b;
    $[2] = x;
  } else {
    x = $[2];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{ input: { a: { b: 2 } }, cond: false }],
  sequentialRenders: [
    { input: { a: { b: 2 } }, cond: false },
    // preserve nullthrows
    { input: null, cond: false },
    { input: null, cond: true },
    { input: {}, cond: false },
    { input: { a: { b: null } }, cond: false },
    { input: { a: null }, cond: false },
    { input: { a: { b: 3 } }, cond: false },
  ],
};

```
      
### Eval output
(kind: ok) [2]
[[ (exception in render) TypeError: Cannot read properties of null (reading 'a') ]]
[[ (exception in render) TypeError: Cannot read properties of null (reading 'a') ]]
[[ (exception in render) TypeError: Cannot read properties of undefined (reading 'b') ]]
[null]
[[ (exception in render) TypeError: Cannot read properties of null (reading 'b') ]]
[3]