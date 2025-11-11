---
title: Use No Memo Module Scope Usememo Function Scope.Expect
category: misc
tags:
- javascript
- testing
last_updated: null
source_file: use-no-memo-module-scope-usememo-function-scope.expect.md
---
# Use No Memo Module Scope Usememo Function Scope.Expect

## Input

```javascript
// @compilationMode:"all"
'use no memo';

function TestComponent({x}) {
  'use memo';
  return <Button>{x}</Button>;
}

```

## Code

```javascript
// @compilationMode:"all"
"use no memo";

function TestComponent({ x }) {
  "use memo";
  return <Button>{x}</Button>;
}

```

### Eval output
(kind: exception) Fixture not implemented