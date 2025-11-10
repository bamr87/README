---
category: misc
last_updated: null
source_file: infer-dont-compile-components-with-multiple-params.expect.md
summary: "```javascript\n// @compilationMode:\"infer\"\n// Takes multiple parameters\
  \  not a component!\nfunction Component(foo, bar) {\n  return <div />;\n}"
tags:
- javascript
title: Infer Dont Compile Components With Multiple Params.Expect
---

## Input

```javascript
// @compilationMode:"infer"
// Takes multiple parameters - not a component!
function Component(foo, bar) {
  return <div />;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [null, null],
};

```

## Code

```javascript
// @compilationMode:"infer"
// Takes multiple parameters - not a component!
function Component(foo, bar) {
  return <div />;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [null, null],
};

```
      
### Eval output
(kind: ok) <div></div>