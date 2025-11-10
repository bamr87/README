---
category: misc
last_updated: null
source_file: constant-computed.expect.md
summary: "```javascript\nfunction Component(props) {\n  const index = 'foo';\n  const\
  \ x = {};\n  x[index] = x[index] + x['bar'];\n  xindex;\n  return x;\n}"
tags:
- javascript
title: Constant Computed.Expect
---

## Input

```javascript
function Component(props) {
  const index = 'foo';
  const x = {};
  x[index] = x[index] + x['bar'];
  x[index](props.foo);
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
  if ($[0] !== props.foo) {
    x = {};
    x.foo = x.foo + x.bar;
    x.foo(props.foo);
    $[0] = props.foo;
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
      