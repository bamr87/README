---
title: Type Test Primitive.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: type-test-primitive.expect.md
---
## Input

```javascript
function component() {
  let x = 1;
  let y = 2;

  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
function component() {
  return 2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) 2