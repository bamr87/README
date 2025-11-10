---
title: Context Variable Reactive Implicit Control Flow.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: context-variable-reactive-implicit-control-flow.expect.md
---
## Input

```javascript
import {conditionalInvoke} from 'shared-runtime';

// same as context-variable-reactive-explicit-control-flow.js, but make
// the control flow implicit

function Component({shouldReassign}) {
  let x = null;
  const reassign = () => {
    x = 2;
  };
  conditionalInvoke(shouldReassign, reassign);
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{shouldReassign: true}],
  sequentialRenders: [{shouldReassign: false}, {shouldReassign: true}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
import { conditionalInvoke } from "shared-runtime";

// same as context-variable-reactive-explicit-control-flow.js, but make
// the control flow implicit

function Component(t0) {
  const $ = _c(2);
  const { shouldReassign } = t0;
  let x;
  if ($[0] !== shouldReassign) {
    x = null;
    const reassign = () => {
      x = 2;
    };

    conditionalInvoke(shouldReassign, reassign);
    $[0] = shouldReassign;
    $[1] = x;
  } else {
    x = $[1];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ shouldReassign: true }],
  sequentialRenders: [{ shouldReassign: false }, { shouldReassign: true }],
};

```
      
### Eval output
(kind: ok) null
2