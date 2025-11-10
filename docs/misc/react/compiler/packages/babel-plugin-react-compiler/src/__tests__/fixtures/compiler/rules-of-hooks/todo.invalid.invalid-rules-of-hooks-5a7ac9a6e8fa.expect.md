---
category: misc
last_updated: null
source_file: todo.invalid.invalid-rules-of-hooks-5a7ac9a6e8fa.expect.md
summary: '```javascript

  // @skip

  // Passed but should have failed'
tags:
- javascript
title: Todo.Invalid.Invalid Rules Of Hooks 5A7Ac9A6E8Fa.Expect
---

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
      