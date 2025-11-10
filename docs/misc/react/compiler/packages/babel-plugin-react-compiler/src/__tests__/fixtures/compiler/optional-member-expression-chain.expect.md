---
category: misc
last_updated: null
source_file: optional-member-expression-chain.expect.md
summary: "``javascript\n// Note that a?.b.c is semantically different from (a?.b).c`\n\
  // We should codegen the correct member expressions\nfunction Component(props) {\n\
  \  let x = props?.b.c;\n  let y = props?.b.c.d?...."
tags:
- javascript
title: Optional Member Expression Chain.Expect
---

## Input

```javascript
// Note that `a?.b.c` is semantically different from `(a?.b).c`
// We should codegen the correct member expressions
function Component(props) {
  let x = props?.b.c;
  let y = props?.b.c.d?.e.f.g?.h;
  return {x, y};
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // Note that `a?.b.c` is semantically different from `(a?.b).c`
// We should codegen the correct member expressions
function Component(props) {
  const $ = _c(3);
  const x = props?.b.c;
  const y = props?.b.c.d?.e.f.g?.h;
  let t0;
  if ($[0] !== x || $[1] !== y) {
    t0 = { x, y };
    $[0] = x;
    $[1] = y;
    $[2] = t0;
  } else {
    t0 = $[2];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      