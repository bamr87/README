---
title: Try Catch Within Function Expression Returns Caught Value.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: try-catch-within-function-expression-returns-caught-value.expect.md
---
# Try Catch Within Function Expression Returns Caught Value.Expect

## Input

```javascript
import {throwInput} from 'shared-runtime';

function Component(props) {
  const callback = () => {
    try {
      throwInput([props.value]);
    } catch (e) {
      return e;
    }
  };
  return callback();
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 42}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
import { throwInput } from "shared-runtime";

function Component(props) {
  const $ = _c(2);
  let t0;
  if ($[0] !== props) {
    const callback = () => {
      try {
        throwInput([props.value]);
      } catch (t1) {
        const e = t1;
        return e;
      }
    };

    t0 = callback();
    $[0] = props;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: 42 }],
};

```

### Eval output
(kind: ok) [42]