---
title: Todo.Invalid.Invalid Rules Of Hooks Acb56658Fe7E.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: todo.invalid.invalid-rules-of-hooks-acb56658fe7e.expect.md
---
# Todo.Invalid.Invalid Rules Of Hooks Acb56658Fe7E.Expect

## Input

```javascript
// @skip
// Passed but should have failed

class C {
  m() {
    This.useHook();
    Super.useHook();
  }
}

```

## Code

```javascript
// @skip
// Passed but should have failed

class C {
  m() {
    This.useHook();
    Super.useHook();
  }
}

```
