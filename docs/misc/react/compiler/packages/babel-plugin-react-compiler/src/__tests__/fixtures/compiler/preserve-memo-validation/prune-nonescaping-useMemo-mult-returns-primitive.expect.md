---
category: misc
last_updated: null
source_file: prune-nonescaping-useMemo-mult-returns-primitive.expect.md
summary: '```javascript

  // @validatePreserveExistingMemoizationGuarantees'
tags:
- javascript
title: Prune Nonescaping Usememo Mult Returns Primitive.Expect
---

## Input

```javascript
// @validatePreserveExistingMemoizationGuarantees

import {useMemo} from 'react';
import {identity} from 'shared-runtime';

function useFoo(cond) {
  useMemo(() => {
    if (cond) {
      return 2;
    } else {
      return identity(5);
    }
  }, [cond]);
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [true],
};

```

## Code

```javascript
// @validatePreserveExistingMemoizationGuarantees

import { useMemo } from "react";
import { identity } from "shared-runtime";

function useFoo(cond) {
  let t0;

  if (cond) {
    t0 = 2;
  } else {
    t0 = identity(5);
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [true],
};

```
      
### Eval output
(kind: ok) 