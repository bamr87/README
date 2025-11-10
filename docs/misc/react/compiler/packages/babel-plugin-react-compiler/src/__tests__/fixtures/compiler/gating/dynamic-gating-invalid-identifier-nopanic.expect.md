---
category: misc
last_updated: null
source_file: dynamic-gating-invalid-identifier-nopanic.expect.md
summary: '```javascript

  // @dynamicGating:{"source":"sharedruntime"} @panicThreshold:"none"'
tags:
- javascript
title: Dynamic Gating Invalid Identifier Nopanic.Expect
---

## Input

```javascript
// @dynamicGating:{"source":"shared-runtime"} @panicThreshold:"none"

function Foo() {
  'use memo if(true)';
  return <div>hello world</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{}],
};

```

## Code

```javascript
// @dynamicGating:{"source":"shared-runtime"} @panicThreshold:"none"

function Foo() {
  "use memo if(true)";
  return <div>hello world</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{}],
};

```
      
### Eval output
(kind: ok) <div>hello world</div>