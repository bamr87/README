---
title: Should Bailout Without Compilation Annotation Mode.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: should-bailout-without-compilation-annotation-mode.expect.md
---
# Should Bailout Without Compilation Annotation Mode.Expect

## Input

```javascript
// @gating @panicThreshold:"none" @compilationMode:"annotation"
let someGlobal = 'joe';

function Component() {
  'use forget';
  someGlobal = 'wat';
  return null;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```

## Code

```javascript
// @gating @panicThreshold:"none" @compilationMode:"annotation"
let someGlobal = "joe";

function Component() {
  "use forget";
  someGlobal = "wat";
  return null;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```

### Eval output
(kind: ok) null