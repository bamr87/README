---
category: development
last_updated: null
source_file: infer-deps-on-retry.expect.md
summary: '```javascript

  // @inferEffectDependencies @panicThreshold:"none"

  import {useRef, AUTODEPS} from ''react'';

  import {useSpecialEffect} from ''sharedruntime'';'
tags:
- javascript
- development
title: Infer Deps On Retry.Expect
---

## Input

```javascript
// @inferEffectDependencies @panicThreshold:"none"
import {useRef, AUTODEPS} from 'react';
import {useSpecialEffect} from 'shared-runtime';

/**
 * The retry pipeline disables memoization features, which means we need to
 * provide an alternate implementation of effect dependencies which does not
 * rely on memoization.
 */
function useFoo({cond}) {
  const ref = useRef();
  const derived = cond ? ref.current : makeObject();
  useSpecialEffect(
    () => {
      log(derived);
    },
    [derived],
    AUTODEPS
  );
  return ref;
}

```

## Code

```javascript
// @inferEffectDependencies @panicThreshold:"none"
import { useRef, AUTODEPS } from "react";
import { useSpecialEffect } from "shared-runtime";

/**
 * The retry pipeline disables memoization features, which means we need to
 * provide an alternate implementation of effect dependencies which does not
 * rely on memoization.
 */
function useFoo(t0) {
  const { cond } = t0;
  const ref = useRef();
  const derived = cond ? ref.current : makeObject();
  useSpecialEffect(
    () => {
      log(derived);
    },

    [derived],
    [derived],
  );
  return ref;
}

```
      
### Eval output
(kind: exception) Fixture not implemented