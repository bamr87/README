---
category: misc
last_updated: null
source_file: object-literal-method-call-in-ternary-test.expect.md
summary: "```javascript\nimport {\n  createHookWrapper,\n  identity,\n  CONSTSTRING0,\n\
  \  CONSTSTRING1,\n} from 'sharedruntime';"
tags:
- javascript
title: Object Literal Method Call In Ternary Test.Expect
---

## Input

```javascript
import {
  createHookWrapper,
  identity,
  CONST_STRING0,
  CONST_STRING1,
} from 'shared-runtime';

function useHook({value}) {
  return {
    getValue() {
      return identity(value);
    },
  }.getValue()
    ? CONST_STRING0
    : CONST_STRING1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: createHookWrapper(useHook),
  params: [{value: 0}],
};

```

## Code

```javascript
import {
  createHookWrapper,
  identity,
  CONST_STRING0,
  CONST_STRING1,
} from "shared-runtime";

function useHook(t0) {
  const { value } = t0;
  return {
    getValue() {
      return identity(value);
    },
  }.getValue()
    ? CONST_STRING0
    : CONST_STRING1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: createHookWrapper(useHook),
  params: [{ value: 0 }],
};

```
      
### Eval output
(kind: ok) <div>{"result":"global string 1","shouldInvokeFns":true}</div>