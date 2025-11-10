---
title: Should Bailout Without Compilation Infer Mode.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: should-bailout-without-compilation-infer-mode.expect.md
---
## Input

```javascript
// @gating @panicThreshold:"none" @compilationMode:"infer"
let someGlobal = 'joe';

function Component() {
  someGlobal = 'wat';
  return <div>{someGlobal}</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```

## Code

```javascript
// @gating @panicThreshold:"none" @compilationMode:"infer"
let someGlobal = "joe";

function Component() {
  someGlobal = "wat";
  return <div>{someGlobal}</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```
      
### Eval output
(kind: ok) <div>wat</div>