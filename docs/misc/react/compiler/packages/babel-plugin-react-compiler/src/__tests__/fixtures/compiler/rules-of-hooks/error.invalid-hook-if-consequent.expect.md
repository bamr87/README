---
category: misc
last_updated: null
source_file: error.invalid-hook-if-consequent.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x = null;\n  if (props.cond)\
  \ {\n    x = useHook();\n  }\n  return x;\n}"
tags:
- javascript
title: Error.Invalid Hook If Consequent.Expect
---

## Input

```javascript
function Component(props) {
  let x = null;
  if (props.cond) {
    x = useHook();
  }
  return x;
}

```


## Error

```
Found 1 error:

Error: Hooks must always be called in a consistent order, and may not be called conditionally. See the Rules of Hooks (https://react.dev/warnings/invalid-hook-call-warning)

error.invalid-hook-if-consequent.ts:4:8
  2 |   let x = null;
  3 |   if (props.cond) {
> 4 |     x = useHook();
    |         ^^^^^^^ Hooks must always be called in a consistent order, and may not be called conditionally. See the Rules of Hooks (https://react.dev/warnings/invalid-hook-call-warning)
  5 |   }
  6 |   return x;
  7 | }
```
          
      