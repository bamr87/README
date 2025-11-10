---
title: Unused Optional Method Assigned To Variable.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: unused-optional-method-assigned-to-variable.expect.md
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
      