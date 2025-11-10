---
title: Error.Untransformed Fire Reference.Expect
category: api
tags:
- javascript
- api
last_updated: null
source_file: error.untransformed-fire-reference.expect.md
---
## Input

```javascript
// @enableFire @panicThreshold:"none"
import {fire} from 'react';

console.log(fire == null);

```


## Error

```
Found 1 error:

Error: [Fire] Untransformed reference to compiler-required feature.

Either remove this `fire` call or ensure it is successfully transformed by the compiler.

error.untransformed-fire-reference.ts:4:12
  2 | import {fire} from 'react';
  3 |
> 4 | console.log(fire == null);
    |             ^^^^ Untransformed `fire` call
  5 |
```
          
      