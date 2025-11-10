---
category: misc
last_updated: null
source_file: todo.invalid.invalid-rules-of-hooks-8303403b8e4c.expect.md
summary: '```javascript

  // @skip

  // Passed but should have failed'
tags:
- javascript
title: Todo.Invalid.Invalid Rules Of Hooks 8303403B8E4C.Expect
---

## Input

```javascript
// @skip
// Passed but should have failed

class ClassComponentWithHook extends React.Component {
  render() {
    React.useState();
  }
}

```

## Code

```javascript
// @skip
// Passed but should have failed

class ClassComponentWithHook extends React.Component {
  render() {
    React.useState();
  }
}

```
      