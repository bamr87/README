---
category: misc
last_updated: null
source_file: error.invalid-mutate-context.expect.md
summary: "```javascript\nfunction Component(props) {\n  const context = useContext(FooContext);\n\
  \  context.value = props.value;\n  return context.value;\n}"
tags:
- javascript
title: Error.Invalid Mutate Context.Expect
---

## Input

```javascript
function Component(props) {
  const context = useContext(FooContext);
  context.value = props.value;
  return context.value;
}

```


## Error

```
Found 1 error:

Error: This value cannot be modified

Modifying a value returned from 'useContext()' is not allowed..

error.invalid-mutate-context.ts:3:2
  1 | function Component(props) {
  2 |   const context = useContext(FooContext);
> 3 |   context.value = props.value;
    |   ^^^^^^^ value cannot be modified
  4 |   return context.value;
  5 | }
  6 |
```
          
      