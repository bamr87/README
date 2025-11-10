---
category: misc
last_updated: null
source_file: for-with-assignment-as-update.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x = props.init;\n  for\
  \ (let i = 0; i < 100; i = i + 1) {\n    x += i;\n  }\n  return [x];\n}"
tags:
- javascript
title: For With Assignment As Update.Expect
---

## Input

```javascript
function Component(props) {
  let x = props.init;
  for (let i = 0; i < 100; i = i + 1) {
    x += i;
  }
  return [x];
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{init: 0}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  let x = props.init;
  for (let i = 0; i < 100; i = i + 1) {
    x = x + i;
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
  params: [{ init: 0 }],
};

```
      
### Eval output
(kind: ok) [4950]