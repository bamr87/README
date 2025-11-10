---
category: misc
last_updated: null
source_file: error.invalid-rewrite-deps-no-array-literal.expect.md
summary: '```javascript

  // @enableFire

  import {fire} from ''react'';'
tags:
- javascript
title: Error.Invalid Rewrite Deps No Array Literal.Expect
---

## Input

```javascript
// @enableFire
import {fire} from 'react';

function Component(props) {
  const foo = props => {
    console.log(props);
  };

  const deps = [foo, props];

  useEffect(() => {
    fire(foo(props));
  }, deps);

  return null;
}

```


## Error

```
Found 1 error:

Error: Cannot compile `fire`

You must use an array literal for an effect dependency array when that effect uses `fire()`.

error.invalid-rewrite-deps-no-array-literal.ts:13:5
  11 |   useEffect(() => {
  12 |     fire(foo(props));
> 13 |   }, deps);
     |      ^^^^ Cannot compile `fire`
  14 |
  15 |   return null;
  16 | }
```
          
      