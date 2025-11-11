---
title: Destructuring Default Past End Of Array.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: destructuring-default-past-end-of-array.expect.md
---
# Destructuring Default Past End Of Array.Expect

## Input

```javascript
function Component(props) {
  // destructure past end of empty array, should evaluate to default
  const [x = 42] = props.value;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: []}],
};

```

## Code

```javascript
function Component(props) {
  const [t0] = props.value;
  const x = t0 === undefined ? 42 : t0;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: [] }],
};

```

### Eval output
(kind: ok) 42