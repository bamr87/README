---
category: misc
last_updated: null
source_file: rules-of-hooks-e5dd6caf4084.expect.md
summary: "```javascript\n// Valid because functions can call functions.\nfunction\
  \ normalFunctionWithConditionalFunction() {\n  if (cond) {\n    doSomething();\n\
  \  }\n}"
tags:
- javascript
title: Rules Of Hooks E5Dd6Caf4084.Expect
---

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
      