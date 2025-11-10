---
title: Todo.Invalid.Invalid Rules Of Hooks 206E2811C87C.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: todo.invalid.invalid-rules-of-hooks-206e2811c87c.expect.md
---
## Input

```javascript
// @skip
// Passed but should have failed

// This is a false positive (it's valid) that unfortunately
// we cannot avoid. Prefer to rename it to not start with "use"
class Foo extends Component {
  render() {
    if (cond) {
      FooStore.useFeatureFlag();
    }
  }
}

```

## Code

```javascript
// @skip
// Passed but should have failed

// This is a false positive (it's valid) that unfortunately
// we cannot avoid. Prefer to rename it to not start with "use"
class Foo extends Component {
  render() {
    if (cond) {
      FooStore.useFeatureFlag();
    }
  }
}

```
      