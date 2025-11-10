---
title: Error.Invalid Mutate Props Via For Of Iterator.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: error.invalid-mutate-props-via-for-of-iterator.expect.md
---
## Input

```javascript
function Component(props) {
  const items = [];
  for (const x of props.items) {
    x.modified = true;
    items.push(x);
  }
  return items;
}

```


## Error

```
Found 1 error:

Error: This value cannot be modified

Modifying component props or hook arguments is not allowed. Consider using a local variable instead.

error.invalid-mutate-props-via-for-of-iterator.ts:4:4
  2 |   const items = [];
  3 |   for (const x of props.items) {
> 4 |     x.modified = true;
    |     ^ value cannot be modified
  5 |     items.push(x);
  6 |   }
  7 |   return items;
```
          
      