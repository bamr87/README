---
category: misc
last_updated: null
source_file: error.emit-freeze-conflicting-global.expect.md
summary: "```javascript\n// @enableEmitFreeze @instrumentForget\nfunction useFoo(props)\
  \ {\n  const DEV = 'conflicting global';\n  console.log(DEV);\n  return foo(props.x);\n\
  }"
tags:
- javascript
title: Error.Emit Freeze Conflicting Global.Expect
---

## Input

```javascript
// @enableEmitFreeze @instrumentForget
function useFoo(props) {
  const __DEV__ = 'conflicting global';
  console.log(__DEV__);
  return foo(props.x);
}

```


## Error

```
Found 1 error:

Todo: Encountered conflicting global in generated program

Conflict from local binding __DEV__.

error.emit-freeze-conflicting-global.ts:3:8
  1 | // @enableEmitFreeze @instrumentForget
  2 | function useFoo(props) {
> 3 |   const __DEV__ = 'conflicting global';
    |         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Encountered conflicting global in generated program
  4 |   console.log(__DEV__);
  5 |   return foo(props.x);
  6 | }
```
          
      