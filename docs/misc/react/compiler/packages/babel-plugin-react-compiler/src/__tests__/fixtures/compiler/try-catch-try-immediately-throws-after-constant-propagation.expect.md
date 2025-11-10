---
title: Try Catch Try Immediately Throws After Constant Propagation.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: try-catch-try-immediately-throws-after-constant-propagation.expect.md
---
## Input

```javascript
function Component(props) {
  let x = props.default;
  const y = 42;
  try {
    // note: this constant propagates so that we know
    // the handler is unreachable
    return y;
  } catch (e) {
    x = e;
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{default: 42}],
};

```

## Code

```javascript
function Component(props) {
  let x;
  return 42;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ default: 42 }],
};

```
      
### Eval output
(kind: ok) 42