---
category: misc
last_updated: null
source_file: type-binary-operator.expect.md
summary: "```javascript\nfunction component() {\n  let a = some();\n  let b = someOther();\n\
  \  if (a > b) {\n    let m = {};\n  }\n}"
tags:
- javascript
title: Type Binary Operator.Expect
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
      