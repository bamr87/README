---
category: misc
last_updated: null
source_file: rules-of-hooks-cfdfe5572fc7.expect.md
summary: "```javascript\n// Valid because hooks can call hooks.\nfunction useHook()\
  \ {\n  useHook1();\n  useHook2();\n}"
tags:
- javascript
title: Rules Of Hooks Cfdfe5572Fc7.Expect
---

## Input

```javascript
// Valid because hooks can call hooks.
function useHook() {
  useHook1();
  useHook2();
}

```

## Code

```javascript
// Valid because hooks can call hooks.
function useHook() {
  useHook1();
  useHook2();
}

```
      