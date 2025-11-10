---
category: misc
last_updated: null
source_file: error.mutate-property-from-global.expect.md
summary: '```javascript

  let wat = {};'
tags:
- javascript
title: Error.Mutate Property From Global.Expect
---

## Input

```javascript
let wat = {};

function Foo() {
  delete wat.foo;
  return wat;
}

```


## Error

```
Found 1 error:

Error: This value cannot be modified

Modifying a variable defined outside a component or hook is not allowed. Consider using an effect.

error.mutate-property-from-global.ts:4:9
  2 |
  3 | function Foo() {
> 4 |   delete wat.foo;
    |          ^^^ value cannot be modified
  5 |   return wat;
  6 | }
  7 |
```
          
      