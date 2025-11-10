---
category: misc
last_updated: null
source_file: try-catch-try-immediately-returns.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x = props.default;\n \
  \ try {\n    // note: has to be a primitive, we want an instruction that cannot\
  \ throw\n    // to ensure there is no maybethrow terminal..."
tags:
- javascript
title: Try Catch Try Immediately Returns.Expect
---

## Input

```javascript
function Component(props) {
  let x = props.default;
  try {
    // note: has to be a primitive, we want an instruction that cannot throw
    // to ensure there is no maybe-throw terminal
    const y = 42;
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