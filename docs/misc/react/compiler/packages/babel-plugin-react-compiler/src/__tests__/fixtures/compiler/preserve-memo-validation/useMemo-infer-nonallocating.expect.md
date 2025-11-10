---
category: misc
last_updated: null
source_file: useMemo-infer-nonallocating.expect.md
summary: '```javascript

  // @validatePreserveExistingMemoizationGuarantees'
tags:
- javascript
title: Usememo Infer Nonallocating.Expect
---

## Input

```javascript
// @validatePreserveExistingMemoizationGuarantees

import {useMemo} from 'react';

// It's correct to infer a useMemo value is non-allocating
// and not provide it with a reactive scope
function useFoo(num1, num2) {
  return useMemo(() => Math.min(num1, num2), [num1, num2]);
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [2, 3],
};

```

## Code

```javascript
// @validatePreserveExistingMemoizationGuarantees

import { useMemo } from "react";

// It's correct to infer a useMemo value is non-allocating
// and not provide it with a reactive scope
function useFoo(num1, num2) {
  return Math.min(num1, num2);
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [2, 3],
};

```
      
### Eval output
(kind: ok) 2