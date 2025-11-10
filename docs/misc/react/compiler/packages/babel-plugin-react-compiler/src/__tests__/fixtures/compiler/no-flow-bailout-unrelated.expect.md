---
category: misc
last_updated: null
source_file: no-flow-bailout-unrelated.expect.md
summary: '```javascript

  // @enableFlowSuppressions'
tags:
- javascript
title: No Flow Bailout Unrelated.Expect
---

## Input

```javascript
// @enableFlowSuppressions

function useX() {}

function Foo(props) {
  // $FlowFixMe[incompatible-type]
  useX();
  return null;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{}],
};

```

## Code

```javascript
// @enableFlowSuppressions

function useX() {}

function Foo(props) {
  useX();
  return null;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{}],
};

```
      
### Eval output
(kind: ok) null