---
category: misc
last_updated: null
source_file: todo.invalid.invalid-rules-of-hooks-9c79feec4b9b.expect.md
summary: '```javascript

  // @skip

  // Passed but should have failed'
tags:
- javascript
title: Todo.Invalid.Invalid Rules Of Hooks 9C79Feec4B9B.Expect
---

## Input

```javascript
// @skip
// Passed but should have failed

(class {
  h = () => {
    useState();
  };
});

```

## Code

```javascript
// @skip
// Passed but should have failed

(class {
  h = () => {
    useState();
  };
});

```
      