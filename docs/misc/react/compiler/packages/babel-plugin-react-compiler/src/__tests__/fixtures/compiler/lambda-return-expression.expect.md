---
title: Lambda Return Expression.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: lambda-return-expression.expect.md
---
## Input

```javascript
import {invoke} from 'shared-runtime';

function useFoo() {
  const x = {};
  const result = invoke(() => x);
  console.log(result);
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
import { invoke } from "shared-runtime";

function useFoo() {
  const x = {};
  const result = invoke(() => x);
  console.log(result);
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) 
logs: [{}]