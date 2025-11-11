---
title: Todo.Invalid.Invalid Rules Of Hooks 191029Ac48C8.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: todo.invalid.invalid-rules-of-hooks-191029ac48c8.expect.md
---
# Todo.Invalid.Invalid Rules Of Hooks 191029Ac48C8.Expect

## Input

```javascript
// @skip
// Passed but should have failed

// Invalid because it's dangerous.
// Normally, this would crash, but not if you use inline requires.
// This *must* be invalid.
// It's expected to have some false positives, but arguably
// they are confusing anyway due to the use*() convention
// already being associated with Hooks.
useState();
if (foo) {
  const foo = React.useCallback(() => {});
}
useCustomHook();

```

## Code

```javascript
// @skip
// Passed but should have failed

// Invalid because it's dangerous.
// Normally, this would crash, but not if you use inline requires.
// This *must* be invalid.
// It's expected to have some false positives, but arguably
// they are confusing anyway due to the use*() convention
// already being associated with Hooks.
useState();
if (foo) {
  const foo = React.useCallback(() => {});
}
useCustomHook();

```
