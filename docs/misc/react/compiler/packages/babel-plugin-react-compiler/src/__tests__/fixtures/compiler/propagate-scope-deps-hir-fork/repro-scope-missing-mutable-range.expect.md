---
category: misc
last_updated: null
source_file: repro-scope-missing-mutable-range.expect.md
summary: "```javascript\n// @enablePropagateDepsInHIR\nfunction HomeDiscoStoreItemTileRating(props)\
  \ {\n  const item = useFragment();\n  let count = 0;\n  const aggregates = item?.aggregates\
  \ || [];\n  aggregates.forEa..."
tags:
- javascript
title: Repro Scope Missing Mutable Range.Expect
---

## Input

```javascript
// @enablePropagateDepsInHIR
function HomeDiscoStoreItemTileRating(props) {
  const item = useFragment();
  let count = 0;
  const aggregates = item?.aggregates || [];
  aggregates.forEach(aggregate => {
    count += aggregate.count || 0;
  });

  return <Text>{count}</Text>;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @enablePropagateDepsInHIR
function HomeDiscoStoreItemTileRating(props) {
  const $ = _c(4);
  const item = useFragment();
  let count;
  if ($[0] !== item?.aggregates) {
    count = 0;
    const aggregates = item?.aggregates || [];
    aggregates.forEach((aggregate) => {
      count = count + (aggregate.count || 0);
      count;
    });
    $[0] = item?.aggregates;
    $[1] = count;
  } else {
    count = $[1];
  }
  let t0;
  if ($[2] !== count) {
    t0 = <Text>{count}</Text>;
    $[2] = count;
    $[3] = t0;
  } else {
    t0 = $[3];
  }
  return t0;
}

```
      
### Eval output
(kind: exception) Fixture not implemented