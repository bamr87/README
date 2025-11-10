---
title: Rules Of Hooks 4F6C78A14Bf7.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: rules-of-hooks-4f6c78a14bf7.expect.md
---
## Input

```javascript
// Valid although unconditional return doesn't make sense and would fail other rules.
// We could make it invalid but it doesn't matter.
function useUnreachable() {
  return;
  useHook();
}

```

## Code

```javascript
// Valid although unconditional return doesn't make sense and would fail other rules.
// We could make it invalid but it doesn't matter.
function useUnreachable() {}

```
      