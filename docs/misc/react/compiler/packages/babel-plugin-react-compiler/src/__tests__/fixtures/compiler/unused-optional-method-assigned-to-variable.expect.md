---
category: misc
last_updated: null
source_file: unused-optional-method-assigned-to-variable.expect.md
summary: "```javascript\nfunction Component(props) {\n  // unused!\n  const obj =\
  \ makeObject();\n  const  = obj.a?.b?.(props.c);\n  return null;\n}"
tags:
- javascript
title: Unused Optional Method Assigned To Variable.Expect
---

## Input

```javascript
function Component(props) {
  // unused!
  const obj = makeObject();
  const _ = obj.a?.b?.(props.c);
  return null;
}

```

## Code

```javascript
function Component(props) {
  const obj = makeObject();
  obj.a?.b?.(props.c);
  return null;
}

```
      