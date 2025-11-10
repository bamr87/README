---
title: Constant Propagation.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: constant-propagation.expect.md
---
## Input

```javascript
function foo() {
  const a = 1;
  const b = 2;
  const c = 3;
  const d = a + b;
  const e = d * c;
  const f = e / d;
  const g = f - e;

  if (g) {
    console.log('foo');
  }

  const h = g;
  const i = h;
  const j = i;
  return j;
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
  console.log("foo");
  return -6;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) -6
logs: ['foo']