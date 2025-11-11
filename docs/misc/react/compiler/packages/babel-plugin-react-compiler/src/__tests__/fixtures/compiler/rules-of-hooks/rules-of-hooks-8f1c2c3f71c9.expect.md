---
title: Rules Of Hooks 8F1C2C3F71C9.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: rules-of-hooks-8f1c2c3f71c9.expect.md
---
# Rules Of Hooks 8F1C2C3F71C9.Expect

## Input

```javascript
// @compilationMode:"infer"
// Valid because components can use hooks.
function createComponentWithHook() {
  return function ComponentWithHook() {
    useHook();
  };
}

```

## Code

```javascript
// @compilationMode:"infer"
// Valid because components can use hooks.
function createComponentWithHook() {
  return function ComponentWithHook() {
    useHook();
  };
}

```
