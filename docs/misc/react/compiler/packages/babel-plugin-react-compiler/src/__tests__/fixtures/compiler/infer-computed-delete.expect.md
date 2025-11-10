---
category: misc
last_updated: null
source_file: infer-computed-delete.expect.md
summary: "```javascript\n// @debug @enablePreserveExistingMemoizationGuarantees:false\n\
  function Component(props) {\n  const x = makeObject();\n  const y = delete x[props.value];\n\
  \  return y;\n}"
tags:
- javascript
title: Infer Computed Delete.Expect
---

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
      