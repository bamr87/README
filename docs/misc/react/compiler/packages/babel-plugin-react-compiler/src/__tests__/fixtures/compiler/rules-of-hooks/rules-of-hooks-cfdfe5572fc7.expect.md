---
title: Rules Of Hooks Cfdfe5572Fc7.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: rules-of-hooks-cfdfe5572fc7.expect.md
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
      