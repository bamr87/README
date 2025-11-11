---
title: Rules Of Hooks 0E2214Abc294.Expect
category: misc
tags:
- javascript
- testing
last_updated: null
source_file: rules-of-hooks-0e2214abc294.expect.md
---
# Rules Of Hooks 0E2214Abc294.Expect

## Input

```javascript
// Valid because exceptions abort rendering
function RegressionTest() {
  if (page == null) {
    throw new Error('oh no!');
  }
  useState();
}

```

## Code

```javascript
// Valid because exceptions abort rendering
function RegressionTest() {
  if (page == null) {
    throw new Error("oh no!");
  }

  useState();
}

```
