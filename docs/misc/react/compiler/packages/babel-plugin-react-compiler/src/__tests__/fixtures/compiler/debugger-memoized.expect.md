---
category: misc
last_updated: null
source_file: debugger-memoized.expect.md
summary: "```javascript\nfunction Component(props) {\n  const x = [];\n  debugger;\n\
  \  x.push(props.value);\n  return x;\n}"
tags:
- javascript
title: Debugger Memoized.Expect
---

## Input

```javascript
function Component(props) {
  const x = [];
  debugger;
  x.push(props.value);
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  let x;
  if ($[0] !== props.value) {
    x = [];
    debugger;

    x.push(props.value);
    $[0] = props.value;
    $[1] = x;
  } else {
    x = $[1];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      