---
title: Todo.Invalid.Invalid Rules Of Hooks Ddeca9708B63.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: todo.invalid.invalid-rules-of-hooks-ddeca9708b63.expect.md
---
## Input

```javascript
// @skip
// Passed but should have failed

(class {
  i() {
    useState();
  }
});

```

## Code

```javascript
// @skip
// Passed but should have failed

(class {
  i() {
    useState();
  }
});

```
      