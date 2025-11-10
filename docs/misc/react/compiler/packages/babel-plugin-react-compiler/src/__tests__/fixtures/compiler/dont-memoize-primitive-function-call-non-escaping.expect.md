---
category: misc
last_updated: null
source_file: dont-memoize-primitive-function-call-non-escaping.expect.md
summary: '```javascript

  // @compilationMode:"infer" @enablePreserveExistingMemoizationGuarantees @validatePreserveExistingMemoizationGuarantees

  import {useMemo} from ''react'';

  import {makeObjectPrimitives, Valid...'
tags:
- javascript
title: Dont Memoize Primitive Function Call Non Escaping.Expect
---

## Input

```javascript
// @compilationMode:"infer" @enablePreserveExistingMemoizationGuarantees @validatePreserveExistingMemoizationGuarantees
import {useMemo} from 'react';
import {makeObject_Primitives, ValidateMemoization} from 'shared-runtime';

function Component(props) {
  const result = makeObject(props.value).value + 1;
  console.log(result);
  return 'ok';
}

function makeObject(value) {
  console.log(value);
  return {value};
}

export const FIXTURE_ENTRYPOINT = {
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

export const FIXTURE_ENTRYPOINT = {
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
(kind: ok) "ok"
"ok"
"ok"
"ok"
"ok"
"ok"
"ok"
"ok"
logs: [42,43,42,43,3.14,4.140000000000001,3.14,4.140000000000001,42,43,3.14,4.140000000000001,42,43,3.14,4.140000000000001]