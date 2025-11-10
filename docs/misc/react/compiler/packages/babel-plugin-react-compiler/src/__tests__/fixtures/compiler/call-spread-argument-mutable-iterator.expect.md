---
category: misc
last_updated: null
source_file: call-spread-argument-mutable-iterator.expect.md
summary: '```javascript

  import {useIdentity} from ''sharedruntime'';'
tags:
- javascript
title: Call Spread Argument Mutable Iterator.Expect
---

## Input

```javascript
import {useIdentity} from 'shared-runtime';

function useFoo() {
  const it = new Set([1, 2]).values();
  useIdentity();
  return Math.max(...it);
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{}],
  sequentialRenders: [{}, {}],
};

```

## Code

```javascript
import { useIdentity } from "shared-runtime";

function useFoo() {
  const it = new Set([1, 2]).values();
  useIdentity();
  return Math.max(...it);
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{}],
  sequentialRenders: [{}, {}],
};

```
      
### Eval output
(kind: ok) 2
2