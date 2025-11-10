---
title: Rules Of Hooks 33A6E23Edac1.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: rules-of-hooks-33a6e23edac1.expect.md
---
## Input

```javascript
// @compilationMode:"infer"
// Valid because hooks can use hooks.
function createHook() {
  return function useHookWithHook() {
    useHook();
  };
}

```

## Code

```javascript
// @compilationMode:"infer"
// Valid because hooks can use hooks.
function createHook() {
  return function useHookWithHook() {
    useHook();
  };
}

```
      