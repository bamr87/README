---
category: misc
last_updated: null
source_file: destructuring-with-conditional-as-default-value.expect.md
summary: "```javascript\nfunction Component(props) {\n  const [x = true ? 1 : 0] =\
  \ props.y;\n  return x;\n}"
tags:
- javascript
title: Destructuring With Conditional As Default Value.Expect
---

## Input

```javascript
function Component(props) {
  const [x = true ? 1 : 0] = props.y;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{y: []}],
};

```

## Code

```javascript
function Component(props) {
  const [t0] = props.y;
  const x = t0 === undefined ? (true ? 1 : 0) : t0;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ y: [] }],
};

```
      
### Eval output
(kind: ok) 1