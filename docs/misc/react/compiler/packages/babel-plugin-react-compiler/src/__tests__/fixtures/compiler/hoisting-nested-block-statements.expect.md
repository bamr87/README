---
title: Hoisting Nested Block Statements.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: hoisting-nested-block-statements.expect.md
---
# Hoisting Nested Block Statements.Expect

## Input

```javascript
import {print} from 'shared-runtime';

function hoisting(cond) {
  if (cond) {
    const x = 1;
    print(x);
  }

  const x = 2;
  print(x);
}

export const FIXTURE_ENTRYPOINT = {
  fn: hoisting,
  params: [false],
};

```

## Code

```javascript
import { print } from "shared-runtime";

function hoisting(cond) {
  if (cond) {
    print(1);
  }

  print(2);
}

export const FIXTURE_ENTRYPOINT = {
  fn: hoisting,
  params: [false],
};

```

### Eval output
(kind: ok)
logs: [2]