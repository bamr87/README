---
title: Dce Unused Const.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: dce-unused-const.expect.md
---
# Dce Unused Const.Expect

## Input

```javascript
function Component(props) {
  const _ = 42;
  return props.value;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 42}],
};

```

## Code

```javascript
function Component(props) {
  return props.value;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: 42 }],
};

```

### Eval output
(kind: ok) 42