---
title: Ssa Simple.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: ssa-simple.expect.md
---
## Input

```javascript
function foo() {
  let x = 1;
  let y = 2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
function foo() {}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) 