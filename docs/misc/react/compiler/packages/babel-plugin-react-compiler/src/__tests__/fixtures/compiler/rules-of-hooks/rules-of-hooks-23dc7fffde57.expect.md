---
category: misc
last_updated: null
source_file: rules-of-hooks-23dc7fffde57.expect.md
summary: "```javascript\n// Valid because hooks can call hooks.\nfunction useHook()\
  \ {\n  return useHook1() + useHook2();\n}"
tags:
- javascript
title: Rules Of Hooks 23Dc7Fffde57.Expect
---

## Input

```javascript
// Valid because hooks can call hooks.
function useHook() {
  return useHook1() + useHook2();
}

```

## Code

```javascript
// Valid because hooks can call hooks.
function useHook() {
  return useHook1() + useHook2();
}

```
      