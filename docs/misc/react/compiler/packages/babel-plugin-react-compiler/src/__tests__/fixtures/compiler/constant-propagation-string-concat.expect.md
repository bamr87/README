---
title: Constant Propagation String Concat.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: constant-propagation-string-concat.expect.md
---
# Constant Propagation String Concat.Expect

## Input

```javascript
function foo() {
  const a = 'a' + 'b';
  const c = 'c';
  return a + c;
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
  return "abc";
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```

### Eval output
(kind: ok) "abc"