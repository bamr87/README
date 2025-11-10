---
category: misc
last_updated: null
source_file: error.invalid-prop-mutation-indirect.expect.md
summary: "```javascript\nfunction Component(props) {\n  const f = () => {\n    props.value\
  \ = true;\n  };\n  const g = () => {\n    f();\n  };\n  g();\n}"
tags:
- javascript
title: Error.Invalid Prop Mutation Indirect.Expect
---

## Input

```javascript
function Component(props) {
  const f = () => {
    props.value = true;
  };
  const g = () => {
    f();
  };
  g();
}

```


## Error

```
Found 1 error:

Error: This value cannot be modified

Modifying component props or hook arguments is not allowed. Consider using a local variable instead.

error.invalid-prop-mutation-indirect.ts:3:4
  1 | function Component(props) {
  2 |   const f = () => {
> 3 |     props.value = true;
    |     ^^^^^ `props` cannot be modified
  4 |   };
  5 |   const g = () => {
  6 |     f();
```
          
      