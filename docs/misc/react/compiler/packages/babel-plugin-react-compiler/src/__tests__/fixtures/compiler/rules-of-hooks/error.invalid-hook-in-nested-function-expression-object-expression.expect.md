---
title: Error.Invalid Hook In Nested Function Expression Object Expression.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: error.invalid-hook-in-nested-function-expression-object-expression.expect.md
---
# Error.Invalid Hook In Nested Function Expression Object Expression.Expect

## Input

```javascript
// @compilationMode:"infer"
function Component() {
  'use memo';
  const f = () => {
    const x = {
      outer() {
        const g = () => {
          const y = {
            inner() {
              return useFoo();
            },
          };
          return y;
        };
      },
    };
    return x;
  };
}

```


## Error

```
Found 1 error:

Error: Hooks must be called at the top level in the body of a function component or custom hook, and may not be called within function expressions. See the Rules of Hooks (https://react.dev/warnings/invalid-hook-call-warning)

Cannot call hook within a function expression.

error.invalid-hook-in-nested-function-expression-object-expression.ts:10:21
   8 |           const y = {
   9 |             inner() {
> 10 |               return useFoo();
     |                      ^^^^^^ Hooks must be called at the top level in the body of a function component or custom hook, and may not be called within function expressions. See the Rules of Hooks (https://react.dev/warnings/invalid-hook-call-warning)
  11 |             },
  12 |           };
  13 |           return y;
```

