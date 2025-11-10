---
category: misc
last_updated: null
source_file: error.invalid-mutate-after-freeze.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x = [];"
tags:
- javascript
title: Error.Invalid Mutate After Freeze.Expect
---

## Input

```javascript
function Component(props) {
  let x = [];

  let _ = <Component x={x} />;

  // x is Frozen at this point
  x.push(props.p2);

  return <div>{_}</div>;
}

```


## Error

```
Found 1 error:

Error: This value cannot be modified

Modifying a value used previously in JSX is not allowed. Consider moving the modification before the JSX.

error.invalid-mutate-after-freeze.ts:7:2
   5 |
   6 |   // x is Frozen at this point
>  7 |   x.push(props.p2);
     |   ^ value cannot be modified
   8 |
   9 |   return <div>{_}</div>;
  10 | }
```
          
      