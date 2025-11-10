---
category: misc
last_updated: null
source_file: todo.invalid.invalid-rules-of-hooks-c59788ef5676.expect.md
summary: '```javascript

  // @skip

  // Passed but should have failed'
tags:
- javascript
title: Todo.Invalid.Invalid Rules Of Hooks C59788Ef5676.Expect
---

## Input

```javascript
// @skip
// Passed but should have failed

// Currently invalid because it violates the convention and removes the "taint"
// from a hook. We *could* make it valid to avoid some false positives but let's
// ensure that we don't break the "renderItem" and "normalFunctionWithConditionalHook"
// cases which must remain invalid.
function normalFunctionWithHook() {
  useHookInsideNormalFunction();
}

```

## Code

```javascript
// @skip
// Passed but should have failed

// Currently invalid because it violates the convention and removes the "taint"
// from a hook. We *could* make it valid to avoid some false positives but let's
// ensure that we don't break the "renderItem" and "normalFunctionWithConditionalHook"
// cases which must remain invalid.
function normalFunctionWithHook() {
  useHookInsideNormalFunction();
}

```
      