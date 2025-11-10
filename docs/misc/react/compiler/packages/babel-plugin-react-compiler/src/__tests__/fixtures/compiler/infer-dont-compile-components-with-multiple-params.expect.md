---
title: Infer Dont Compile Components With Multiple Params.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: infer-dont-compile-components-with-multiple-params.expect.md
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