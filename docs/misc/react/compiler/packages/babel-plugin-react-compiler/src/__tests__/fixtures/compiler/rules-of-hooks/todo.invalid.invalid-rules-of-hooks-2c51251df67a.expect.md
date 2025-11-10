---
category: misc
last_updated: null
source_file: todo.invalid.invalid-rules-of-hooks-2c51251df67a.expect.md
summary: '```javascript

  // @skip

  // Passed but should have failed'
tags:
- javascript
title: Todo.Invalid.Invalid Rules Of Hooks 2C51251Df67A.Expect
---

## Input

```javascript
// @skip
// Passed but should have failed

(class {
  useHook() {
    useState();
  }
});

```

## Code

```javascript
// @skip
// Passed but should have failed

(class {
  useHook() {
    useState();
  }
});

```
      