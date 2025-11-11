---
title: Call Spread Argument Set.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: call-spread-argument-set.expect.md
---
# Call Spread Argument Set.Expect

## Input

```javascript
import {useIdentity} from 'shared-runtime';

/**
 * Forked version of call-spread-argument-mutable-iterator that is known to not mutate
 * the spread argument since it is a Set
 */
function useFoo() {
  const s = new Set([1, 2]);
  useIdentity(null);
  return [Math.max(...s), s];
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{}],
  sequentialRenders: [{}, {}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
import { useIdentity } from "shared-runtime";

/**
 * Forked version of call-spread-argument-mutable-iterator that is known to not mutate
 * the spread argument since it is a Set
 */
function useFoo() {
  const $ = _c(2);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = new Set([1, 2]);
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const s = t0;
  useIdentity(null);
  let t1;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = [Math.max(...s), s];
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{}],
  sequentialRenders: [{}, {}],
};

```

### Eval output
(kind: ok) [2,{"kind":"Set","value":[1,2]}]
[2,{"kind":"Set","value":[1,2]}]