---
category: misc
last_updated: null
source_file: uncond-subpath-order3.expect.md
summary: "```javascript\n// Determine that we only need to track p.a here\n// Ordering\
  \ of access should not matter\nfunction TestDepsSubpathOrder3(props) {\n  let x\
  \ = {};\n  x.c = props.a.b.c;\n  x.a = props.a;\n  x.b..."
tags:
- javascript
- testing
title: Uncond Subpath Order3.Expect
---

## Input

```javascript
// Determine that we only need to track p.a here
// Ordering of access should not matter
function TestDepsSubpathOrder3(props) {
  let x = {};
  x.c = props.a.b.c;
  x.a = props.a;
  x.b = props.a.b;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: TestDepsSubpathOrder3,
  params: [{a: {b: {c: 2}}}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // Determine that we only need to track p.a here
// Ordering of access should not matter
function TestDepsSubpathOrder3(props) {
  const $ = _c(2);
  let x;
  if ($[0] !== props.a) {
    x = {};
    x.c = props.a.b.c;
    x.a = props.a;
    x.b = props.a.b;
    $[0] = props.a;
    $[1] = x;
  } else {
    x = $[1];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: TestDepsSubpathOrder3,
  params: [{ a: { b: { c: 2 } } }],
};

```
      
### Eval output
(kind: ok) {"c":2,"a":{"b":{"c":2}},"b":"[[ cyclic ref *2 ]]"}