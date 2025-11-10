---
category: misc
last_updated: null
source_file: infer-property-delete.expect.md
summary: "```javascript\n// @enablePreserveExistingMemoizationGuarantees:false\nfunction\
  \ Component(props) {\n  const x = makeObject();\n  const y = delete x.value;\n \
  \ return y;\n}"
tags:
- javascript
title: Infer Property Delete.Expect
---

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
      