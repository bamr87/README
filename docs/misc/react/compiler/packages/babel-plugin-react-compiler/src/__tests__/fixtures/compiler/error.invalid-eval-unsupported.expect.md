---
category: misc
last_updated: null
source_file: error.invalid-eval-unsupported.expect.md
summary: "```javascript\nfunction Component(props) {\n  eval('props.x = true');\n\
  \  return <div />;\n}"
tags:
- javascript
title: Error.Invalid Eval Unsupported.Expect
---

## Input

```javascript
function Component(props) {
  eval('props.x = true');
  return <div />;
}

```


## Error

```
Found 1 error:

Compilation Skipped: The 'eval' function is not supported

Eval is an anti-pattern in JavaScript, and the code executed cannot be evaluated by React Compiler.

error.invalid-eval-unsupported.ts:2:2
  1 | function Component(props) {
> 2 |   eval('props.x = true');
    |   ^^^^ The 'eval' function is not supported
  3 |   return <div />;
  4 | }
  5 |
```
          
      