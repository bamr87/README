---
title: Error.Todo Repro Named Function With Shadowed Local Same Name.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: error.todo-repro-named-function-with-shadowed-local-same-name.expect.md
---
# Error.Todo Repro Named Function With Shadowed Local Same Name.Expect

## Input

```javascript
// @enableNewMutationAliasingModel
function Component(props) {
  function hasErrors() {
    let hasErrors = false;
    if (props.items == null) {
      hasErrors = true;
    }
    return hasErrors;
  }
  return hasErrors();
}

```


## Error

```
Found 1 error:

Invariant: [InferMutationAliasingEffects] Expected value kind to be initialized

<unknown> hasErrors_0$15:TFunction.

error.todo-repro-named-function-with-shadowed-local-same-name.ts:10:9
   8 |     return hasErrors;
   9 |   }
> 10 |   return hasErrors();
     |          ^^^^^^^^^ this is uninitialized
  11 | }
  12 |
```

