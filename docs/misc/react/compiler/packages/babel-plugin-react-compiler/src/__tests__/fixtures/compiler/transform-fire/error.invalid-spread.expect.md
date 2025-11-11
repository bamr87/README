---
title: Error.Invalid Spread.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: error.invalid-spread.expect.md
---
# Error.Invalid Spread.Expect

## Input

```javascript
// @enableFire
import {fire} from 'react';

function Component(props) {
  const foo = () => {
    console.log(props);
  };
  useEffect(() => {
    fire(...foo);
  });

  return null;
}

```


## Error

```
Found 1 error:

Error: Cannot compile `fire`

fire() can only take in a single call expression as an argument but received a spread argument.

error.invalid-spread.ts:9:4
   7 |   };
   8 |   useEffect(() => {
>  9 |     fire(...foo);
     |     ^^^^^^^^^^^^ Cannot compile `fire`
  10 |   });
  11 |
  12 |   return null;
```

