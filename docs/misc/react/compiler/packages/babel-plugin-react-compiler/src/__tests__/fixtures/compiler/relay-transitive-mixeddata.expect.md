---
title: Relay Transitive Mixeddata.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: relay-transitive-mixeddata.expect.md
---
## Input

```javascript
import {useFragment} from 'shared-runtime';

/**
 * React compiler should infer that the returned value is a primitive and avoid
 * memoizing it.
 */
function useRelayData({query, idx}) {
  'use memo';
  const data = useFragment('', query);
  return data.a[idx].toString();
}

export const FIXTURE_ENTRYPOINT = {
  fn: useRelayData,
  params: [{query: '', idx: 0}],
  sequentialRenders: [
    {query: '', idx: 0},
    {query: '', idx: 0},
    {query: '', idx: 1},
  ],
};

```

## Code

```javascript
import { useFragment } from "shared-runtime";

/**
 * React compiler should infer that the returned value is a primitive and avoid
 * memoizing it.
 */
function useRelayData(t0) {
  "use memo";
  const { query, idx } = t0;

  const data = useFragment("", query);
  return data.a[idx].toString();
}

export const FIXTURE_ENTRYPOINT = {
  fn: useRelayData,
  params: [{ query: "", idx: 0 }],
  sequentialRenders: [
    { query: "", idx: 0 },
    { query: "", idx: 0 },
    { query: "", idx: 1 },
  ],
};

```
      
### Eval output
(kind: ok) "1"
"1"
"2"