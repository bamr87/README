---
title: Unused Ternary Assigned To Variable.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: unused-ternary-assigned-to-variable.expect.md
---
# Unused Ternary Assigned To Variable.Expect

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
