---
category: api
last_updated: null
source_file: error.invalid-dynamic-hook-via-hooklike-local.expect.md
summary: "```javascript\nfunction Component() {\n  const someFunction = useContext(FooContext);\n\
  \  const useOhItsNamedLikeAHookNow = someFunction;\n  useOhItsNamedLikeAHookNow();\n\
  }"
tags:
- javascript
- api
title: Error.Invalid Dynamic Hook Via Hooklike Local.Expect
---

## Input

```javascript
function Component() {
  const someFunction = useContext(FooContext);
  const useOhItsNamedLikeAHookNow = someFunction;
  useOhItsNamedLikeAHookNow();
}

```


## Error

```
Found 1 error:

Error: Hooks must be the same function on every render, but this value may change over time to a different function. See https://react.dev/reference/rules/react-calls-components-and-hooks#dont-dynamically-use-hooks

error.invalid-dynamic-hook-via-hooklike-local.ts:4:2
  2 |   const someFunction = useContext(FooContext);
  3 |   const useOhItsNamedLikeAHookNow = someFunction;
> 4 |   useOhItsNamedLikeAHookNow();
    |   ^^^^^^^^^^^^^^^^^^^^^^^^^ Hooks must be the same function on every render, but this value may change over time to a different function. See https://react.dev/reference/rules/react-calls-components-and-hooks#dont-dynamically-use-hooks
  5 | }
  6 |
```
          
      