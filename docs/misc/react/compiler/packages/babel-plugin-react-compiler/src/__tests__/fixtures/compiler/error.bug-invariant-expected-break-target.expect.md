---
category: misc
last_updated: null
source_file: error.bug-invariant-expected-break-target.expect.md
summary: '```javascript

  import {useMemo} from ''react'';'
tags:
- javascript
title: Error.Bug Invariant Expected Break Target.Expect
---

## Input

```javascript
import {useMemo} from 'react';

export default function useFoo(text) {
  return useMemo(() => {
    try {
      let formattedText = '';
      try {
        formattedText = format(text);
      } catch {
        console.log('error');
      }
      return formattedText || '';
    } catch (e) {}
  }, [text]);
}

```


## Error

```
Found 1 error:

Invariant: Expected a break target
```
          
      