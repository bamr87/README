---
title: Error.Todo Function Expression References Later Variable Declaration.Expect
category: api
tags:
- javascript
- api
last_updated: null
source_file: error.todo-function-expression-references-later-variable-declaration.expect.md
---
# Error.Todo Function Expression References Later Variable Declaration.Expect

## Input

```javascript
function Component() {
  let callback = () => {
    onClick = () => {};
  };
  let onClick;

  return <div onClick={callback} />;
}

```


## Error

```
Found 1 error:

Error: Cannot reassign variable after render completes

Reassigning `onClick` after render has completed can cause inconsistent behavior on subsequent renders. Consider using state instead.

error.todo-function-expression-references-later-variable-declaration.ts:3:4
  1 | function Component() {
  2 |   let callback = () => {
> 3 |     onClick = () => {};
    |     ^^^^^^^ Cannot reassign `onClick` after render completes
  4 |   };
  5 |   let onClick;
  6 |
```

