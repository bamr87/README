---
category: misc
last_updated: null
source_file: todo.bail.rules-of-hooks-279ac76f53af.expect.md
summary: '```javascript

  // @skip

  // Unsupported input'
tags:
- javascript
- testing
title: Todo.Bail.Rules Of Hooks 279Ac76F53Af.Expect
---

## Input

```javascript
// @skip
// Unsupported input

// Valid -- this is a regression test.
jest.useFakeTimers();
beforeEach(() => {
  jest.useRealTimers();
});

```

## Code

```javascript
// @skip
// Unsupported input

// Valid -- this is a regression test.
jest.useFakeTimers();
beforeEach(() => {
  jest.useRealTimers();
});

```
      