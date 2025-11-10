---
category: misc
last_updated: null
source_file: prune-scopes-whose-deps-invalidate-array.expect.md
summary: '```javascript

  import {useHook} from ''sharedruntime'';'
tags:
- javascript
title: Prune Scopes Whose Deps Invalidate Array.Expect
---

## Input

```javascript
import {useHook} from 'shared-runtime';

function Component(props) {
  const x = [];
  useHook(); // intersperse a hook call to prevent memoization of x
  x.push(props.value);

  const y = [x];

  return [y];
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 'sathya'}],
};

```

## Code

```javascript
import { useHook } from "shared-runtime";

function Component(props) {
  const x = [];
  useHook();
  x.push(props.value);

  const y = [x];
  return [y];
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: "sathya" }],
};

```
      
### Eval output
(kind: ok) [[["sathya"]]]