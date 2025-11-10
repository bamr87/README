---
title: Error.Todo.Try Catch With Throw.Expect
category: development
tags:
- javascript
- development
last_updated: null
source_file: error.todo.try-catch-with-throw.expect.md
---
## Input

```javascript
function Component(props) {
  let x;
  try {
    throw [];
  } catch (e) {
    x.push(e);
  }
  return x;
}

```


## Error

```
Found 1 error:

Todo: (BuildHIR::lowerStatement) Support ThrowStatement inside of try/catch

error.todo.try-catch-with-throw.ts:4:4
  2 |   let x;
  3 |   try {
> 4 |     throw [];
    |     ^^^^^^^^^ (BuildHIR::lowerStatement) Support ThrowStatement inside of try/catch
  5 |   } catch (e) {
  6 |     x.push(e);
  7 |   }
```
          
      