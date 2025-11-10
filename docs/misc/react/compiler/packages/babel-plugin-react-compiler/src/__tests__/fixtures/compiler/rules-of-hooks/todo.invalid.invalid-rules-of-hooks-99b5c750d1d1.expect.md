---
category: misc
last_updated: null
source_file: todo.invalid.invalid-rules-of-hooks-99b5c750d1d1.expect.md
summary: '```javascript

  // @skip

  // Passed but should have failed'
tags:
- javascript
title: Todo.Invalid.Invalid Rules Of Hooks 99B5C750D1D1.Expect
---

## Input

```javascript
// @skip
// Passed but should have failed

class ClassComponentWithFeatureFlag extends React.Component {
  render() {
    if (foo) {
      useFeatureFlag();
    }
  }
}

```

## Code

```javascript
// @skip
// Passed but should have failed

class ClassComponentWithFeatureFlag extends React.Component {
  render() {
    if (foo) {
      useFeatureFlag();
    }
  }
}

```
      