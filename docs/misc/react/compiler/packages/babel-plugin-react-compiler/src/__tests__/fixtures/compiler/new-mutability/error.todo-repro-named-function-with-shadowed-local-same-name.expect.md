---
category: misc
last_updated: null
source_file: error.todo-repro-named-function-with-shadowed-local-same-name.expect.md
summary: "```javascript\n// @enableNewMutationAliasingModel\nfunction Component(props)\
  \ {\n  function hasErrors() {\n    let hasErrors = false;\n    if (props.items ==\
  \ null) {\n      hasErrors = true;\n    }\n    return..."
tags:
- javascript
title: Error.Todo Repro Named Function With Shadowed Local Same Name.Expect
---

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
          
      