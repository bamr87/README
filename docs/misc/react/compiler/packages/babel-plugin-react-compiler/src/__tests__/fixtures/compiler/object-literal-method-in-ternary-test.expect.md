---
category: misc
last_updated: null
source_file: object-literal-method-in-ternary-test.expect.md
summary: '```javascript

  import {createHookWrapper, CONSTSTRING0, CONSTSTRING1} from ''sharedruntime'';'
tags:
- javascript
title: Object Literal Method In Ternary Test.Expect
---

## Input

```javascript
import {createHookWrapper, CONST_STRING0, CONST_STRING1} from 'shared-runtime';

function useHook({value}) {
  return {
    getValue() {
      return identity(value);
    },
  }
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
  CONST_STRING0,
  CONST_STRING1,
} from "shared-runtime";

function useHook(t0) {
  const { value } = t0;
  return {
    getValue() {
      return identity(value);
    },
  }
    ? CONST_STRING0
    : CONST_STRING1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: createHookWrapper(useHook),
  params: [{ value: 0 }],
};

```
      
### Eval output
(kind: ok) <div>{"result":"global string 0","shouldInvokeFns":true}</div>