---
category: misc
last_updated: null
source_file: for-in-statement-type-inference.expect.md
summary: '```javascript

  // @enablePreserveExistingMemoizationGuarantees:false

  const {identity, mutate} = require(''sharedruntime'');'
tags:
- javascript
title: For In Statement Type Inference.Expect
---

## Input

```javascript
// @enablePreserveExistingMemoizationGuarantees:false
const {identity, mutate} = require('shared-runtime');

function Component(props) {
  let x;
  const object = {...props.value};
  for (const y in object) {
    x = y;
  }
  mutate(x); // can't modify, x is known primitive!
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: {a: 'a', b: 'B', c: 'C!'}}],
};

```

## Code

```javascript
// @enablePreserveExistingMemoizationGuarantees:false
const { identity, mutate } = require("shared-runtime");

function Component(props) {
  let x;
  const object = { ...props.value };
  for (const y in object) {
    x = y;
  }

  mutate(x);
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: { a: "a", b: "B", c: "C!" } }],
};

```
      
### Eval output
(kind: ok) "c"