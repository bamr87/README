---
category: misc
last_updated: null
source_file: error.declare-reassign-variable-in-function-declaration.expect.md
summary: "```javascript\nfunction Component() {\n  let x = null;\n  function foo()\
  \ {\n    x = 9;\n  }\n  const y = bar(foo);\n  return <Child y={y} />;\n}"
tags:
- javascript
title: Error.Declare Reassign Variable In Function Declaration.Expect
---

## Input

```javascript
function Component() {
  let x = null;
  function foo() {
    x = 9;
  }
  const y = bar(foo);
  return <Child y={y} />;
}

```


## Error

```
Found 1 error:

Error: Cannot reassign variable after render completes

Reassigning `x` after render has completed can cause inconsistent behavior on subsequent renders. Consider using state instead.

error.declare-reassign-variable-in-function-declaration.ts:4:4
  2 |   let x = null;
  3 |   function foo() {
> 4 |     x = 9;
    |     ^ Cannot reassign `x` after render completes
  5 |   }
  6 |   const y = bar(foo);
  7 |   return <Child y={y} />;
```
          
      