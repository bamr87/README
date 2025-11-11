---
title: Todo.Invalid.Invalid Rules Of Hooks 5A7Ac9A6E8Fa.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: todo.invalid.invalid-rules-of-hooks-5a7ac9a6e8fa.expect.md
---
# Todo.Invalid.Invalid Rules Of Hooks 5A7Ac9A6E8Fa.Expect

## Input

```javascript
// @skip
// Passed but should have failed

// These are neither functions nor hooks.
function _normalFunctionWithHook() {
  useHookInsideNormalFunction();
}
function _useNotAHook() {
  useHookInsideNormalFunction();
}

```

## Code

```javascript
// @skip
// Passed but should have failed

// These are neither functions nor hooks.
function _normalFunctionWithHook() {
  useHookInsideNormalFunction();
}

function _useNotAHook() {
  useHookInsideNormalFunction();
}

```
