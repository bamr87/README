---
title: Error.Invalid Conditionally Call Prop Named Like Hook.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: error.invalid-conditionally-call-prop-named-like-hook.expect.md
---
# Error.Invalid Conditionally Call Prop Named Like Hook.Expect

## Input

```javascript
function Component({cond, useFoo}) {
  if (cond) {
    useFoo();
  }
}

```


## Error

```
Found 1 error:

Error: Hooks must always be called in a consistent order, and may not be called conditionally. See the Rules of Hooks (https://react.dev/warnings/invalid-hook-call-warning)

error.invalid-conditionally-call-prop-named-like-hook.ts:3:4
  1 | function Component({cond, useFoo}) {
  2 |   if (cond) {
> 3 |     useFoo();
    |     ^^^^^^ Hooks must always be called in a consistent order, and may not be called conditionally. See the Rules of Hooks (https://react.dev/warnings/invalid-hook-call-warning)
  4 |   }
  5 | }
  6 |
```

