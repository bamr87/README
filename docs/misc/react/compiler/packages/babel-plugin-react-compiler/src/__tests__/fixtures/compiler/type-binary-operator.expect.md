---
title: Type Binary Operator.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: type-binary-operator.expect.md
---
## Input

```javascript
function component() {
  let a = some();
  let b = someOther();
  if (a > b) {
    let m = {};
  }
}

```

## Code

```javascript
function component() {
  const a = some();
  const b = someOther();
  if (a > b) {
  }
}

```
      