---
category: api
last_updated: null
source_file: error.capitalized-method-call.expect.md
summary: "```javascript\n// @validateNoCapitalizedCalls\nfunction Component() {\n\
  \  const x = someGlobal.SomeFunc();"
tags:
- javascript
- api
- api
title: Error.Capitalized Method Call.Expect
---

## Input

```javascript
// @validateNoCapitalizedCalls
function Component() {
  const x = someGlobal.SomeFunc();

  return x;
}

```


## Error

```
Found 1 error:

Error: Capitalized functions are reserved for components, which must be invoked with JSX. If this is a component, render it with JSX. Otherwise, ensure that it has no hook calls and rename it to begin with a lowercase letter. Alternatively, if you know for a fact that this function is not a component, you can allowlist it via the compiler config

SomeFunc may be a component.

error.capitalized-method-call.ts:3:12
  1 | // @validateNoCapitalizedCalls
  2 | function Component() {
> 3 |   const x = someGlobal.SomeFunc();
    |             ^^^^^^^^^^^^^^^^^^^^^ Capitalized functions are reserved for components, which must be invoked with JSX. If this is a component, render it with JSX. Otherwise, ensure that it has no hook calls and rename it to begin with a lowercase letter. Alternatively, if you know for a fact that this function is not a component, you can allowlist it via the compiler config
  4 |
  5 |   return x;
  6 | }
```
          
      