---
category: development
last_updated: null
source_file: error.todo.try-catch-with-throw.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x;\n  try {\n    throw\
  \ [];\n  } catch (e) {\n    x.push(e);\n  }\n  return x;\n}"
tags:
- javascript
- development
title: Error.Todo.Try Catch With Throw.Expect
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
          
      