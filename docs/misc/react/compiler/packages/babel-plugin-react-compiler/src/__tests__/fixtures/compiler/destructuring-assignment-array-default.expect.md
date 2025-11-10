---
category: misc
last_updated: null
source_file: destructuring-assignment-array-default.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x;\n  if (props.cond)\
  \ {\n    [[x] = ['default']] = props.y;\n  } else {\n    x = props.fallback;\n \
  \ }\n  return x;\n}"
tags:
- javascript
title: Destructuring Assignment Array Default.Expect
---

## Input

```javascript
function Component(props) {
  let x;
  if (props.cond) {
    [[x] = ['default']] = props.y;
  } else {
    x = props.fallback;
  }
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
  if (props.cond) {
    const [t0] = props.y;
    let t1;
    if ($[0] !== t0) {
      t1 = t0 === undefined ? ["default"] : t0;
      $[0] = t0;
      $[1] = t1;
    } else {
      t1 = $[1];
    }
    [x] = t1;
  } else {
    x = props.fallback;
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      