---
title: Rules Of Hooks E5Dd6Caf4084.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: rules-of-hooks-e5dd6caf4084.expect.md
---
# Rules Of Hooks E5Dd6Caf4084.Expect

## Input

```javascript
// Valid because functions can call functions.
function normalFunctionWithConditionalFunction() {
  if (cond) {
    doSomething();
  }
}

```

## Code

```javascript
// Valid because functions can call functions.
function normalFunctionWithConditionalFunction() {
  if (cond) {
    doSomething();
  }
}

```
