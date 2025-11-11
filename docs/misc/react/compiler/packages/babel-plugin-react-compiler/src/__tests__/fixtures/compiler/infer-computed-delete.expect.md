---
title: Infer Computed Delete.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: infer-computed-delete.expect.md
---
# Infer Computed Delete.Expect

## Input

```javascript
// @debug @enablePreserveExistingMemoizationGuarantees:false
function Component(props) {
  const x = makeObject();
  const y = delete x[props.value];
  return y;
}

```

## Code

```javascript
// @debug @enablePreserveExistingMemoizationGuarantees:false
function Component(props) {
  const x = makeObject();
  const y = delete x[props.value];
  return y;
}

```
