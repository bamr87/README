---
title: Infer Property Delete.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: infer-property-delete.expect.md
---
# Infer Property Delete.Expect

## Input

```javascript
// @enablePreserveExistingMemoizationGuarantees:false
function Component(props) {
  const x = makeObject();
  const y = delete x.value;
  return y;
}

```

## Code

```javascript
// @enablePreserveExistingMemoizationGuarantees:false
function Component(props) {
  const x = makeObject();
  const y = delete x.value;
  return y;
}

```
