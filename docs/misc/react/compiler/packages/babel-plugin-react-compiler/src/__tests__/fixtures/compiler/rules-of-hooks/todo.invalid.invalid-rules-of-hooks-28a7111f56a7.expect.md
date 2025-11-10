---
category: misc
last_updated: null
source_file: todo.invalid.invalid-rules-of-hooks-28a7111f56a7.expect.md
summary: '```javascript

  // @skip

  // Passed but should have failed'
tags:
- javascript
title: Todo.Invalid.Invalid Rules Of Hooks 28A7111F56A7.Expect
---

## Input

```javascript
// @skip
// Passed but should have failed

// Technically this is a false positive.
// We *could* make it valid (and it used to be).
//
// However, top-level Hook-like calls can be very dangerous
// in environments with inline requires because they can mask
// the runtime error by accident.
// So we prefer to disallow it despite the false positive.

const {createHistory, useBasename} = require('history-2.1.2');
const browserHistory = useBasename(createHistory)({
  basename: '/',
});

```

## Code

```javascript
// @skip
// Passed but should have failed

// Technically this is a false positive.
// We *could* make it valid (and it used to be).
//
// However, top-level Hook-like calls can be very dangerous
// in environments with inline requires because they can mask
// the runtime error by accident.
// So we prefer to disallow it despite the false positive.

const { createHistory, useBasename } = require("history-2.1.2");
const browserHistory = useBasename(createHistory)({
  basename: "/",
});

```
      