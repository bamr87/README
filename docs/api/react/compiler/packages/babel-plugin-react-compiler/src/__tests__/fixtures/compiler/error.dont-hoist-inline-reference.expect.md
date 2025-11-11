---
title: Error.Dont Hoist Inline Reference.Expect
category: api
tags:
- javascript
- api
last_updated: null
source_file: error.dont-hoist-inline-reference.expect.md
---
# Error.Dont Hoist Inline Reference.Expect

## Input

```javascript
import {identity} from 'shared-runtime';
function useInvalid() {
  const x = identity(x);
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useInvalid,
  params: [],
};

```


## Error

```
Found 1 error:

Todo: [hoisting] EnterSSA: Expected identifier to be defined before being used

Identifier x$1 is undefined.

error.dont-hoist-inline-reference.ts:3:2
  1 | import {identity} from 'shared-runtime';
  2 | function useInvalid() {
> 3 |   const x = identity(x);
    |   ^^^^^^^^^^^^^^^^^^^^^^ [hoisting] EnterSSA: Expected identifier to be defined before being used
  4 |   return x;
  5 | }
  6 |
```

