---
category: misc
last_updated: null
source_file: unused-ternary-assigned-to-variable.expect.md
summary: "```javascript\nfunction Component(props) {\n  // unused!\n  const obj =\
  \ makeObject();\n  const  = obj.a ? props.b : props.c;\n  return null;\n}"
tags:
- javascript
title: Unused Ternary Assigned To Variable.Expect
---

## Input

```javascript
function Component(props) {
  // unused!
  const obj = makeObject();
  const _ = obj.a ? props.b : props.c;
  return null;
}

```

## Code

```javascript
function Component(props) {
  const obj = makeObject();
  obj.a ? props.b : props.c;
  return null;
}

```
      