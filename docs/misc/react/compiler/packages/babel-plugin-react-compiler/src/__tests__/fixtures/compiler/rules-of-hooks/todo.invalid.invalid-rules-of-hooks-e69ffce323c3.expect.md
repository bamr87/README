---
category: misc
last_updated: null
source_file: todo.invalid.invalid-rules-of-hooks-e69ffce323c3.expect.md
summary: '```javascript

  // @skip

  // Passed but should have failed'
tags:
- javascript
title: Todo.Invalid.Invalid Rules Of Hooks E69Ffce323C3.Expect
---

## Input

```javascript
// @skip
// Passed but should have failed

(class {
  useHook = () => {
    useState();
  };
});

```

## Code

```javascript
// @skip
// Passed but should have failed

(class {
  useHook = () => {
    useState();
  };
});

```
      