---
title: Use No Forget With No Errors.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: use-no-forget-with-no-errors.expect.md
---
# Use No Forget With No Errors.Expect

## Input

```javascript
function Component() {
  'use no forget';
  return <div>Hello World</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  isComponent: true,
};

```

## Code

```javascript
function Component() {
  "use no forget";
  return <div>Hello World</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  isComponent: true,
};

```

### Eval output
(kind: ok) <div>Hello World</div>