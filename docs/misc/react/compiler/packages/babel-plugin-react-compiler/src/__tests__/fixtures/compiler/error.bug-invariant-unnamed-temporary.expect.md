---
category: misc
last_updated: null
source_file: error.bug-invariant-unnamed-temporary.expect.md
summary: '```javascript

  import Bar from ''./Bar'';'
tags:
- javascript
title: Error.Bug Invariant Unnamed Temporary.Expect
---

## Input

```javascript
import Bar from './Bar';

export function Foo() {
  return (
    <Bar
      renderer={(...props) => {
        return <span {...props}>{displayValue}</span>;
      }}
    />
  );
}

```


## Error

```
Found 1 error:

Invariant: Expected temporaries to be promoted to named identifiers in an earlier pass

identifier 15 is unnamed.
```
          
      