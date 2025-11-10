---
title: Skip Usememocache.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: skip-useMemoCache.expect.md
---
## Input

```javascript
import {c as useMemoCache} from 'react/compiler-runtime';

function Component(props) {
  const $ = useMemoCache();
  let x;
  if ($[0] === undefined) {
    x = [props.value];
    $[0] = x;
  } else {
    x = $[0];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 42}],
};

```

## Code

```javascript
import { c as useMemoCache } from "react/compiler-runtime";

function Component(props) {
  const $ = useMemoCache();
  let x;
  if ($[0] === undefined) {
    x = [props.value];
    $[0] = x;
  } else {
    x = $[0];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: 42 }],
};

```
      
### Eval output
(kind: ok) [42]