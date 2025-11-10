---
category: development
last_updated: null
source_file: error.todo-object-expression-computed-key-mutate-key-while-constructing-object.expect.md
summary: '```javascript

  import {identity, mutate, mutateAndReturn} from ''sharedruntime'';'
tags:
- javascript
- development
title: Error.Todo Object Expression Computed Key Mutate Key While Constructing Object.Expect
---

## Input

```javascript
import {identity, mutate, mutateAndReturn} from 'shared-runtime';

function Component(props) {
  const key = {};
  const context = {
    [mutateAndReturn(key)]: identity([props.value]),
  };
  return context;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 42}],
};

```


## Error

```
Found 1 error:

Todo: (BuildHIR::lowerExpression) Expected Identifier, got CallExpression key in ObjectExpression

error.todo-object-expression-computed-key-mutate-key-while-constructing-object.ts:6:5
  4 |   const key = {};
  5 |   const context = {
> 6 |     [mutateAndReturn(key)]: identity([props.value]),
    |      ^^^^^^^^^^^^^^^^^^^^ (BuildHIR::lowerExpression) Expected Identifier, got CallExpression key in ObjectExpression
  7 |   };
  8 |   return context;
  9 | }
```
          
      