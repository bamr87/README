---
category: misc
last_updated: null
source_file: rules-of-hooks-fe6042f7628b.expect.md
summary: "```javascript\n// @compilationMode:\"infer\"\n// This is valid because \"\
  use\"prefixed functions called in\n// unnamed function arguments are not assumed\
  \ to be hooks.\nunknownFunction(function (foo, bar) {\n  ..."
tags:
- javascript
title: Rules Of Hooks Fe6042F7628B.Expect
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
      