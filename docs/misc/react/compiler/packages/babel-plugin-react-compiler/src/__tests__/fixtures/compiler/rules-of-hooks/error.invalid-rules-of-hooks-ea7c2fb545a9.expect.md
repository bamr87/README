---
title: Error.Invalid Rules Of Hooks Ea7C2Fb545A9.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: error.invalid-rules-of-hooks-ea7c2fb545a9.expect.md
---
# Error.Invalid Rules Of Hooks Ea7C2Fb545A9.Expect

## Input

```javascript
// Expected to fail

// Invalid because it's dangerous and might not warn otherwise.
// This *must* be invalid.
function useHookWithConditionalHook() {
  if (cond) {
    useConditionalHook();
  }
}

```


## Error

```
Found 1 error:

Error: Hooks must always be called in a consistent order, and may not be called conditionally. See the Rules of Hooks (https://react.dev/warnings/invalid-hook-call-warning)

error.invalid-rules-of-hooks-ea7c2fb545a9.ts:7:4
   5 | function useHookWithConditionalHook() {
   6 |   if (cond) {
>  7 |     useConditionalHook();
     |     ^^^^^^^^^^^^^^^^^^ Hooks must always be called in a consistent order, and may not be called conditionally. See the Rules of Hooks (https://react.dev/warnings/invalid-hook-call-warning)
   8 |   }
   9 | }
  10 |
```

