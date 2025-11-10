---
category: misc
last_updated: null
source_file: object-literal-spread-element.expect.md
summary: "```javascript\nfunction Component(props) {\n  const x = {...props.foo};\n\
  \  return x;\n}"
tags:
- javascript
title: Object Literal Spread Element.Expect
---

## Input

```javascript
function Component(props) {
  const x = {...props.foo};
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
  let t0;
  if ($[0] !== props.foo) {
    t0 = { ...props.foo };
    $[0] = props.foo;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const x = t0;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      