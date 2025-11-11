---
title: For In Statement Body Always Returns.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: for-in-statement-body-always-returns.expect.md
---
# For In Statement Body Always Returns.Expect

## Input

```javascript
function Component(props) {
  for (const x in props.value) {
    return x;
  }
  return null;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: {a: 'A!'}}],
};

```

## Code

```javascript
function Component(props) {
  for (const x in props.value) {
    return x;
  }
  return null;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: { a: "A!" } }],
};

```

### Eval output
(kind: ok) "a"