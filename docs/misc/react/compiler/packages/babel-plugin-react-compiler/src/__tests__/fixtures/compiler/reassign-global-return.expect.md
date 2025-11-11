---
title: Reassign Global Return.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: reassign-global-return.expect.md
---
# Reassign Global Return.Expect

## Input

```javascript
let b = 1;

export default function useMyHook() {
  const fn = () => {
    b = 2;
  };
  return fn;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useMyHook,
  params: [],
};

```

## Code

```javascript
let b = 1;

export default function useMyHook() {
  const fn = _temp;
  return fn;
}
function _temp() {
  b = 2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useMyHook,
  params: [],
};

```

### Eval output
(kind: ok) "[[ function params=0 ]]"