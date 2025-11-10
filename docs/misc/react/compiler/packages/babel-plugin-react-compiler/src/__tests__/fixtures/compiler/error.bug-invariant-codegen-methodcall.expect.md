---
title: Error.Bug Invariant Codegen Methodcall.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: error.bug-invariant-codegen-methodcall.expect.md
---
## Input

```javascript
const YearsAndMonthsSince = () => {
  const diff = foo();
  const months = Math.floor(diff.bar());
  return <>{months}</>;
};

```


## Error

```
Found 1 error:

Invariant: [Codegen] Internal error: MethodCall::property must be an unpromoted + unmemoized MemberExpression

error.bug-invariant-codegen-methodcall.ts:3:17
  1 | const YearsAndMonthsSince = () => {
  2 |   const diff = foo();
> 3 |   const months = Math.floor(diff.bar());
    |                  ^^^^^^^^^^ Got: 'Identifier'
  4 |   return <>{months}</>;
  5 | };
  6 |
```
          
      