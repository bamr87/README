---
category: misc
last_updated: null
source_file: unused-logical-assigned-to-variable.expect.md
summary: "```javascript\nfunction Component(props) {\n  // unused!\n  const obj =\
  \ makeObject();\n  const obj2 = makeObject();\n  const  = (obj.a ?? obj2.b) || props.c;\n\
  \  return null;\n}"
tags:
- javascript
title: Unused Logical Assigned To Variable.Expect
---

## Input

```javascript
function Component(props) {
  // unused!
  const obj = makeObject();
  const obj2 = makeObject();
  const _ = (obj.a ?? obj2.b) || props.c;
  return null;
}

```

## Code

```javascript
function Component(props) {
  const obj = makeObject();
  const obj2 = makeObject();
  (obj.a ?? obj2.b) || props.c;
  return null;
}

```
      