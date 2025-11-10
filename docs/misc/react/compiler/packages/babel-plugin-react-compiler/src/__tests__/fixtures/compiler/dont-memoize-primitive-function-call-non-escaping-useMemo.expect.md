---
category: misc
last_updated: null
source_file: dont-memoize-primitive-function-call-non-escaping-useMemo.expect.md
summary: '```javascript

  // @compilationMode:"infer" @enablePreserveExistingMemoizationGuarantees @validatePreserveExistingMemoizationGuarantees

  import {useMemo} from ''react'';

  import {makeObjectPrimitives, Valid...'
tags:
- javascript
title: Dont Memoize Primitive Function Call Non Escaping Usememo.Expect
---

## Input

```javascript
// @compilationMode:"infer" @enablePreserveExistingMemoizationGuarantees @validatePreserveExistingMemoizationGuarantees
import {useMemo} from 'react';
import {makeObject_Primitives, ValidateMemoization} from 'shared-runtime';

function Component(props) {
  const result = useMemo(
    () => makeObject(props.value).value + 1,
    [props.value]
  );
  console.log(result);
  return 'ok';
}

function makeObject(value) {
  console.log(value);
  return {value};
}

export const TODO_FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 42}],
  sequentialRenders: [
    {value: 42},
    {value: 42},
    {value: 3.14},
    {value: 3.14},
    {value: 42},
    {value: 3.14},
    {value: 42},
    {value: 3.14},
  ],
};

```

## Code

```javascript
// @compilationMode:"infer" @enablePreserveExistingMemoizationGuarantees @validatePreserveExistingMemoizationGuarantees
import { useMemo } from "react";
import { makeObject_Primitives, ValidateMemoization } from "shared-runtime";

function Component(props) {
  const result = makeObject(props.value).value + 1;

  console.log(result);
  return "ok";
}

function makeObject(value) {
  console.log(value);
  return { value };
}

export const TODO_FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: 42 }],
  sequentialRenders: [
    { value: 42 },
    { value: 42 },
    { value: 3.14 },
    { value: 3.14 },
    { value: 42 },
    { value: 3.14 },
    { value: 42 },
    { value: 3.14 },
  ],
};

```
      
### Eval output
(kind: exception) Fixture not implemented