---
category: misc
last_updated: null
source_file: rules-of-hooks-dfde14171fcd.expect.md
summary: "```javascript\n// Valid because classes can call functions.\n// We don't\
  \ consider these to be hooks.\nclass C {\n  m() {\n    this.useHook();\n    super.useHook();\n\
  \  }\n}"
tags:
- javascript
title: Rules Of Hooks Dfde14171Fcd.Expect
---

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
      