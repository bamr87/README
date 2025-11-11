---
title: Rules Of Hooks C5D1F3143C4C.Expect
category: misc
tags:
- javascript
- testing
last_updated: null
source_file: rules-of-hooks-c5d1f3143c4c.expect.md
---
# Rules Of Hooks C5D1F3143C4C.Expect

## Input

```javascript
// Regression test for incorrectly flagged valid code.
function RegressionTest() {
  const foo = cond ? a : b;
  useState();
}

```

## Code

```javascript
// Regression test for incorrectly flagged valid code.
function RegressionTest() {
  cond ? a : b;
  useState();
}

```
