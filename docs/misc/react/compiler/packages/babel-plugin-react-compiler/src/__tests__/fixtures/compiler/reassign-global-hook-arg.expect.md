---
title: Reassign Global Hook Arg.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: reassign-global-hook-arg.expect.md
---
# Reassign Global Hook Arg.Expect

## Input

```javascript
let b = 1;

export default function MyApp() {
  const fn = () => {
    b = 2;
  };
  return useFoo(fn);
}

function useFoo(fn) {}

export const FIXTURE_ENTRYPOINT = {
  fn: MyApp,
  params: [],
};

```

## Code

```javascript
let b = 1;

export default function MyApp() {
  const fn = _temp;
  return useFoo(fn);
}
function _temp() {
  b = 2;
}

function useFoo(fn) {}

export const FIXTURE_ENTRYPOINT = {
  fn: MyApp,
  params: [],
};

```

### Eval output
(kind: ok)