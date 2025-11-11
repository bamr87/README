---
title: Error.Invalid Uselayouteffect Dep Not Memoized.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: error.invalid-useLayoutEffect-dep-not-memoized.expect.md
---
# Error.Invalid Uselayouteffect Dep Not Memoized.Expect

## Input

```javascript
// @validateMemoizedEffectDependencies
import {useLayoutEffect} from 'react';

function Component(props) {
  const data = {};
  useLayoutEffect(() => {
    console.log(props.value);
  }, [data]);
  mutate(data);
  return data;
}

```


## Error

```
Found 1 error:

Compilation Skipped: React Compiler has skipped optimizing this component because the effect dependencies could not be memoized. Unmemoized effect dependencies can trigger an infinite loop or other unexpected behavior

error.invalid-useLayoutEffect-dep-not-memoized.ts:6:2
   4 | function Component(props) {
   5 |   const data = {};
>  6 |   useLayoutEffect(() => {
     |   ^^^^^^^^^^^^^^^^^^^^^^^
>  7 |     console.log(props.value);
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
>  8 |   }, [data]);
     | ^^^^^^^^^^^^^ React Compiler has skipped optimizing this component because the effect dependencies could not be memoized. Unmemoized effect dependencies can trigger an infinite loop or other unexpected behavior
   9 |   mutate(data);
  10 |   return data;
  11 | }
```

