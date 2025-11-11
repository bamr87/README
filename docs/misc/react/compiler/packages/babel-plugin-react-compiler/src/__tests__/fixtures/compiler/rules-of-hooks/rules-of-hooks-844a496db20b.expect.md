---
title: Rules Of Hooks 844A496Db20B.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: rules-of-hooks-844a496db20b.expect.md
---
# Rules Of Hooks 844A496Db20B.Expect

## Input

```javascript
// Valid because hooks can use hooks.
function useHookWithHook() {
  useHook();
}

```

## Code

```javascript
// Valid because hooks can use hooks.
function useHookWithHook() {
  useHook();
}

```
