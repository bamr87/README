---
title: Destructure Param String Literal Key.Expect
category: misc
tags:
- javascript
- testing
last_updated: null
source_file: destructure-param-string-literal-key.expect.md
---
# Destructure Param String Literal Key.Expect

## Input

```javascript
function foo({data: dataTestID}) {
  return dataTestID;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [{data: {}}],
  isComponent: false,
};

```

## Code

```javascript
function foo(t0) {
  const { data: dataTestID } = t0;
  return dataTestID;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [{ data: {} }],
  isComponent: false,
};

```

### Eval output
(kind: ok) {}