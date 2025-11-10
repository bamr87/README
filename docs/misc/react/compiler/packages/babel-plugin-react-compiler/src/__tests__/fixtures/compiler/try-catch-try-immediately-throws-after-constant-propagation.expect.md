---
category: misc
last_updated: null
source_file: try-catch-try-immediately-throws-after-constant-propagation.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x = props.default;\n \
  \ const y = 42;\n  try {\n    // note: this constant propagates so that we know\n\
  \    // the handler is unreachable\n    return y;\n  } cat..."
tags:
- javascript
title: Try Catch Try Immediately Throws After Constant Propagation.Expect
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