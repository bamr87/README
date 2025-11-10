---
category: misc
last_updated: null
source_file: rules-of-hooks-2bec02ac982b.expect.md
summary: "```javascript\n// @compilationMode:\"infer\"\n// Valid because hooks can\
  \ call hooks.\nfunction createHook() {\n  return function useHook() {\n    useHook1();\n\
  \    useHook2();\n  };\n}"
tags:
- javascript
title: Rules Of Hooks 2Bec02Ac982B.Expect
---

## Input

```javascript
// @compilationMode:"infer"
// Valid because hooks can call hooks.
function createHook() {
  return function useHook() {
    useHook1();
    useHook2();
  };
}

```

## Code

```javascript
// @compilationMode:"infer"
// Valid because hooks can call hooks.
function createHook() {
  return function useHook() {
    useHook1();
    useHook2();
  };
}

```
      