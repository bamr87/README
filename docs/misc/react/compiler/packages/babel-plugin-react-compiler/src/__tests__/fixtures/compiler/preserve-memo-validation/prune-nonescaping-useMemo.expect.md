---
category: misc
last_updated: null
source_file: prune-nonescaping-useMemo.expect.md
summary: '```javascript

  // @validatePreserveExistingMemoizationGuarantees'
tags:
- javascript
title: Prune Nonescaping Usememo.Expect
---

## Input

```javascript
// @validatePreserveExistingMemoizationGuarantees

import {useMemo} from 'react';
import {identity} from 'shared-runtime';

/**
 * This is technically a false positive, although it makes sense
 * to bailout as source code might be doing something sketchy.
 */
function useFoo(x) {
  useMemo(() => identity(x), [x]);
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [2],
};

```

## Code

```javascript
// @validatePreserveExistingMemoizationGuarantees

import { useMemo } from "react";
import { identity } from "shared-runtime";

/**
 * This is technically a false positive, although it makes sense
 * to bailout as source code might be doing something sketchy.
 */
function useFoo(x) {}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [2],
};

```
      
### Eval output
(kind: ok) 