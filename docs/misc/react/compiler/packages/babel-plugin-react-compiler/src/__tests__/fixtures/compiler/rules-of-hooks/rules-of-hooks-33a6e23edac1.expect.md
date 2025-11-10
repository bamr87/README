---
category: misc
last_updated: null
source_file: rules-of-hooks-33a6e23edac1.expect.md
summary: "```javascript\n// @compilationMode:\"infer\"\n// Valid because hooks can\
  \ use hooks.\nfunction createHook() {\n  return function useHookWithHook() {\n \
  \   useHook();\n  };\n}"
tags:
- javascript
title: Rules Of Hooks 33A6E23Edac1.Expect
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
      