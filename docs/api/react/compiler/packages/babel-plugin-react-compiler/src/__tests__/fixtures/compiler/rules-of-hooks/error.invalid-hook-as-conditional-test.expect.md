---
title: Error.Invalid Hook As Conditional Test.Expect
category: api
tags:
- javascript
- testing
- api
last_updated: null
source_file: error.invalid-hook-as-conditional-test.expect.md
---
## Input

```javascript
function Component(props) {
  const x = props.cond ? (useFoo ? 1 : 2) : 3;
  return x;
}

```


## Error

```
Found 1 error:

Error: Hooks may not be referenced as normal values, they must be called. See https://react.dev/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values

error.invalid-hook-as-conditional-test.ts:2:26
  1 | function Component(props) {
> 2 |   const x = props.cond ? (useFoo ? 1 : 2) : 3;
    |                           ^^^^^^ Hooks may not be referenced as normal values, they must be called. See https://react.dev/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values
  3 |   return x;
  4 | }
  5 |
```
          
      