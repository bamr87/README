---
title: Ssa For Trivial Update.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: ssa-for-trivial-update.expect.md
---
## Input

```javascript
function foo() {
  let x = 1;
  for (let i = 0; i < 10; /* update is intentally a single identifier */ i) {
    x += 1;
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
function foo() {
  let x = 1;
  for (const i = 0; true; 0) {
    x = x + 1;
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```
      