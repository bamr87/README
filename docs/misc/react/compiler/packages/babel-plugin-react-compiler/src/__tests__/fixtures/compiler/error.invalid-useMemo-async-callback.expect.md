---
category: misc
last_updated: null
source_file: error.invalid-useMemo-async-callback.expect.md
summary: "```javascript\nfunction component(a, b) {\n  let x = useMemo(async () =>\
  \ {\n    await a;\n  }, []);\n  return x;\n}"
tags:
- javascript
title: Error.Invalid Usememo Async Callback.Expect
---

## Input

```javascript
function component(a, b) {
  let x = useMemo(async () => {
    await a;
  }, []);
  return x;
}

```


## Error

```
Found 1 error:

Error: useMemo() callbacks may not be async or generator functions

useMemo() callbacks are called once and must synchronously return a value.

error.invalid-useMemo-async-callback.ts:2:18
  1 | function component(a, b) {
> 2 |   let x = useMemo(async () => {
    |                   ^^^^^^^^^^^^^
> 3 |     await a;
    | ^^^^^^^^^^^^
> 4 |   }, []);
    | ^^^^ Async and generator functions are not supported
  5 |   return x;
  6 | }
  7 |
```
          
      