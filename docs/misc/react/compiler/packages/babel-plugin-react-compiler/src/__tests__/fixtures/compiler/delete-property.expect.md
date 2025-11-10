---
category: misc
last_updated: null
source_file: delete-property.expect.md
summary: "```javascript\nfunction Component(props) {\n  const x = {a: props.a, b:\
  \ props.b};\n  delete x.b;\n  return x;\n}"
tags:
- javascript
title: Delete Property.Expect
---

## Input

```javascript
function Component(props) {
  const x = {a: props.a, b: props.b};
  delete x.b;
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
  const $ = _c(3);
  let x;
  if ($[0] !== props.a || $[1] !== props.b) {
    x = { a: props.a, b: props.b };
    delete x.b;
    $[0] = props.a;
    $[1] = props.b;
    $[2] = x;
  } else {
    x = $[2];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      