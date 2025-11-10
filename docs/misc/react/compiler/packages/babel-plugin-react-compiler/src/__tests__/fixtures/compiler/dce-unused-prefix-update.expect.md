---
title: Dce Unused Prefix Update.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: dce-unused-prefix-update.expect.md
---
## Input

```javascript
function Component(props) {
  let i = 0;
  --i;
  i = props.i;
  return i;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{i: 42}],
};

```

## Code

```javascript
function Component(props) {
  let i;

  i = props.i;
  return i;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ i: 42 }],
};

```
      
### Eval output
(kind: ok) 42