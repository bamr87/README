---
category: misc
last_updated: null
source_file: error.invalid-multiple-args.expect.md
summary: '```javascript

  // @enableFire

  import {fire} from ''react'';'
tags:
- javascript
title: Error.Invalid Multiple Args.Expect
---

## Input

```javascript
// @enableFire
import {fire} from 'react';

function Component({bar, baz}) {
  const foo = () => {
    console.log(bar, baz);
  };
  useEffect(() => {
    fire(foo(bar), baz);
  });

  return null;
}

```


## Error

```
Found 1 error:

Error: Cannot compile `fire`

fire() can only take in a single call expression as an argument but received multiple arguments.

error.invalid-multiple-args.ts:9:4
   7 |   };
   8 |   useEffect(() => {
>  9 |     fire(foo(bar), baz);
     |     ^^^^^^^^^^^^^^^^^^^ Cannot compile `fire`
  10 |   });
  11 |
  12 |   return null;
```
          
      