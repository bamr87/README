---
category: misc
last_updated: null
source_file: reactive-control-dependency-do-while-indirect.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x = 0;\n  let y = 0;\n\
  \  let z = 0;\n  do {\n    x += 1;\n    y += 1;\n    z = y;\n  } while (x < props.limit);\n\
  \  return [z];\n}"
tags:
- javascript
title: Reactive Control Dependency Do While Indirect.Expect
---

## Input

```javascript
function Component(props) {
  let x = 0;
  let y = 0;
  let z = 0;
  do {
    x += 1;
    y += 1;
    z = y;
  } while (x < props.limit);
  return [z];
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  sequentialRenders: [
    {limit: 10},
    {limit: 10},
    {limit: 1},
    {limit: 1},
    {limit: 10},
    {limit: 1},
    {limit: 10},
    {limit: 1},
  ],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  let x = 0;
  let y = 0;
  let z;
  do {
    x = x + 1;
    y = y + 1;
    z = y;
  } while (x < props.limit);
  let t0;
  if ($[0] !== z) {
    t0 = [z];
    $[0] = z;
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
    { limit: 10 },
    { limit: 10 },
    { limit: 1 },
    { limit: 1 },
    { limit: 10 },
    { limit: 1 },
    { limit: 10 },
    { limit: 1 },
  ],
};

```
      
### Eval output
(kind: ok) [10]
[10]
[1]
[1]
[10]
[1]
[10]
[1]