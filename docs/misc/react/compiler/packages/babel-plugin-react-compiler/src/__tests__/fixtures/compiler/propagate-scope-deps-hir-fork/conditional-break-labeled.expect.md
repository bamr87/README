---
category: misc
last_updated: null
source_file: conditional-break-labeled.expect.md
summary: "``javascript\n// @enablePropagateDepsInHIR\n/\n  props.b does influence\
  \ a`\n /\nfunction Component(props) {\n  const a = [];\n  a.push(props.a);\n  label:\
  \ {\n    if (props.b) {\n      break label;\n    }\n    a.p..."
tags:
- javascript
title: Conditional Break Labeled.Expect
---

## Input

```javascript
// @enablePropagateDepsInHIR
/**
 * props.b *does* influence `a`
 */
function Component(props) {
  const a = [];
  a.push(props.a);
  label: {
    if (props.b) {
      break label;
    }
    a.push(props.c);
  }
  a.push(props.d);
  return a;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @enablePropagateDepsInHIR
/**
 * props.b *does* influence `a`
 */
function Component(props) {
  const $ = _c(5);
  let a;
  if (
    $[0] !== props.a ||
    $[1] !== props.b ||
    $[2] !== props.c ||
    $[3] !== props.d
  ) {
    a = [];
    a.push(props.a);
    bb0: {
      if (props.b) {
        break bb0;
      }

      a.push(props.c);
    }

    a.push(props.d);
    $[0] = props.a;
    $[1] = props.b;
    $[2] = props.c;
    $[3] = props.d;
    $[4] = a;
  } else {
    a = $[4];
  }
  return a;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      