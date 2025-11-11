---
title: Rules Of Hooks Dfde14171Fcd.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: rules-of-hooks-dfde14171fcd.expect.md
---
# Rules Of Hooks Dfde14171Fcd.Expect

## Input

```javascript
// Valid because classes can call functions.
// We don't consider these to be hooks.
class C {
  m() {
    this.useHook();
    super.useHook();
  }
}

```

## Code

```javascript
// Valid because classes can call functions.
// We don't consider these to be hooks.
class C {
  m() {
    this.useHook();
    super.useHook();
  }
}

```
