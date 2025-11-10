---
category: misc
last_updated: null
source_file: dce-unused-const.expect.md
summary: "```javascript\nfunction Component(props) {\n  const  = 42;\n  return props.value;\n\
  }"
tags:
- javascript
title: Dce Unused Const.Expect
---

## Input

```javascript
function Component(props) {
  const _ = 42;
  return props.value;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 42}],
};

```

## Code

```javascript
function Component(props) {
  return props.value;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: 42 }],
};

```
      
### Eval output
(kind: ok) 42