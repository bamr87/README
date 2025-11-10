---
category: development
last_updated: null
source_file: error.todo-object-expression-computed-key-modified-during-after-construction-sequence-expr.expect.md
summary: '```javascript

  import {identity, mutate, mutateAndReturn} from ''sharedruntime'';'
tags:
- javascript
- development
title: Error.Todo Object Expression Computed Key Modified During After Construction
  Sequence Expr.Expect
---

## Input

```javascript
import {identity, mutate, mutateAndReturn} from 'shared-runtime';

function Component(props) {
  const key = {};
  const context = {
    [(mutate(key), key)]: identity([props.value]),
  };
  mutate(key);
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

Todo: (BuildHIR::lowerExpression) Expected Identifier, got SequenceExpression key in ObjectExpression

error.todo-object-expression-computed-key-modified-during-after-construction-sequence-expr.ts:6:6
  4 |   const key = {};
  5 |   const context = {
> 6 |     [(mutate(key), key)]: identity([props.value]),
    |       ^^^^^^^^^^^^^^^^ (BuildHIR::lowerExpression) Expected Identifier, got SequenceExpression key in ObjectExpression
  7 |   };
  8 |   mutate(key);
  9 |   return context;
```
          
      