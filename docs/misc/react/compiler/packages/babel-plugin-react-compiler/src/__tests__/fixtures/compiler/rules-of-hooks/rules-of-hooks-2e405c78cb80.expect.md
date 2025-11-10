---
title: Rules Of Hooks 2E405C78Cb80.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: rules-of-hooks-2e405c78cb80.expect.md
---
## Input

```javascript
// Valid because hooks can call hooks.
function useHook() {
  useState() && a;
}

```

## Code

```javascript
// Valid because hooks can call hooks.
function useHook() {
  useState() && a;
}

```
      