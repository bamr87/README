---
title: Dynamic Gating Noemit.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: dynamic-gating-noemit.expect.md
---
# Dynamic Gating Noemit.Expect

## Input

```javascript
// @dynamicGating:{"source":"shared-runtime"} @noEmit

function Foo() {
  'use memo if(getTrue)';
  return <div>hello world</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{}],
};

```

## Code

```javascript
// @dynamicGating:{"source":"shared-runtime"} @noEmit

function Foo() {
  "use memo if(getTrue)";
  return <div>hello world</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{}],
};

```

### Eval output
(kind: ok) <div>hello world</div>