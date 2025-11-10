---
title: Rules Of Hooks Fe6042F7628B.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: rules-of-hooks-fe6042f7628b.expect.md
---
## Input

```javascript
// @compilationMode:"infer"
// This is valid because "use"-prefixed functions called in
// unnamed function arguments are not assumed to be hooks.
unknownFunction(function (foo, bar) {
  if (foo) {
    useNotAHook(bar);
  }
});

```

## Code

```javascript
// @compilationMode:"infer"
// This is valid because "use"-prefixed functions called in
// unnamed function arguments are not assumed to be hooks.
unknownFunction(function (foo, bar) {
  if (foo) {
    useNotAHook(bar);
  }
});

```
      