---
category: misc
last_updated: null
source_file: todo.invalid.invalid-rules-of-hooks-a63fd4f9dcc0.expect.md
summary: '```javascript

  // @skip

  // Passed but should have failed'
tags:
- javascript
title: Todo.Invalid.Invalid Rules Of Hooks A63Fd4F9Dcc0.Expect
---

## Input

```javascript
// @skip
// Passed but should have failed

// This is invalid because "use"-prefixed functions used in named
// functions are assumed to be hooks.
React.unknownFunction(function notAComponent(foo, bar) {
  useProbablyAHook(bar);
});

```

## Code

```javascript
// @skip
// Passed but should have failed

// This is invalid because "use"-prefixed functions used in named
// functions are assumed to be hooks.
React.unknownFunction(function notAComponent(foo, bar) {
  useProbablyAHook(bar);
});

```
      