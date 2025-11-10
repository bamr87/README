---
title: Const Propagation Into Function Expression Primitive.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: const-propagation-into-function-expression-primitive.expect.md
---
## Input

```javascript
function foo() {
  const x = 42;
  const f = () => {
    console.log(x);
  };
  f();
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
  const f = _temp;

  f();
  return 42;
}
function _temp() {
  console.log(42);
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) 42
logs: [42]