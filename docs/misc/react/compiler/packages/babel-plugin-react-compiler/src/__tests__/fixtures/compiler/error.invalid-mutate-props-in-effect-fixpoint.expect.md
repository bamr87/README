---
category: misc
last_updated: null
source_file: error.invalid-mutate-props-in-effect-fixpoint.expect.md
summary: '```javascript

  import {useEffect} from ''react'';'
tags:
- javascript
title: Error.Invalid Mutate Props In Effect Fixpoint.Expect
---

## Input

```javascript
import {useEffect} from 'react';

function Component(props) {
  let x = null;
  while (x == null) {
    x = props.value;
  }
  let y = x;
  let mutateProps = () => {
    y.foo = true;
  };
  let mutatePropsIndirect = () => {
    mutateProps();
  };
  useEffect(() => mutatePropsIndirect(), [mutatePropsIndirect]);
}

```


## Error

```
Found 1 error:

Error: This value cannot be modified

Modifying component props or hook arguments is not allowed. Consider using a local variable instead.

error.invalid-mutate-props-in-effect-fixpoint.ts:10:4
   8 |   let y = x;
   9 |   let mutateProps = () => {
> 10 |     y.foo = true;
     |     ^ `y` cannot be modified
  11 |   };
  12 |   let mutatePropsIndirect = () => {
  13 |     mutateProps();
```
          
      