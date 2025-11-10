---
category: misc
last_updated: null
source_file: uncond-subpath-order1.expect.md
summary: "```javascript\n// Determine that we only need to track p.a here\n// Ordering\
  \ of access should not matter\nfunction TestDepsSubpathOrder1(props) {\n  let x\
  \ = {};\n  x.b = props.a.b;\n  x.a = props.a;\n  x.c =..."
tags:
- javascript
- testing
title: Uncond Subpath Order1.Expect
---

## Input

```javascript
// Determine that we only need to track p.a here
// Ordering of access should not matter
function TestDepsSubpathOrder1(props) {
  let x = {};
  x.b = props.a.b;
  x.a = props.a;
  x.c = props.a.b.c;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: TestDepsSubpathOrder1,
  params: [{a: {b: {c: 2}}}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // Determine that we only need to track p.a here
// Ordering of access should not matter
function TestDepsSubpathOrder1(props) {
  const $ = _c(2);
  let x;
  if ($[0] !== props.a) {
    x = {};
    x.b = props.a.b;
    x.a = props.a;
    x.c = props.a.b.c;
    $[0] = props.a;
    $[1] = x;
  } else {
    x = $[1];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: TestDepsSubpathOrder1,
  params: [{ a: { b: { c: 2 } } }],
};

```
      
### Eval output
(kind: ok) {"b":{"c":2},"a":{"b":"[[ cyclic ref *1 ]]"},"c":2}