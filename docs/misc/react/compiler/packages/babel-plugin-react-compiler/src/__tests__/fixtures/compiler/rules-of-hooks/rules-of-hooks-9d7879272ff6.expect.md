---
category: misc
last_updated: null
source_file: rules-of-hooks-9d7879272ff6.expect.md
summary: "```javascript\n// Valid because hooks can call hooks.\nfunction useHook()\
  \ {\n  return useHook1(useHook2());\n}"
tags:
- javascript
title: Rules Of Hooks 9D7879272Ff6.Expect
---

## Input

```javascript
// Valid because hooks can call hooks.
function useHook() {
  return useHook1(useHook2());
}

```

## Code

```javascript
// Valid because hooks can call hooks.
function useHook() {
  return useHook1(useHook2());
}

```
      