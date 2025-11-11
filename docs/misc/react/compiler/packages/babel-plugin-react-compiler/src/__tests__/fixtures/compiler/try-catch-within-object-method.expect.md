---
title: Try Catch Within Object Method.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: try-catch-within-object-method.expect.md
---
# Try Catch Within Object Method.Expect

## Input

```javascript
function Component(props) {
  const object = {
    foo() {
      try {
        return [];
      } catch (e) {
        return;
      }
    },
  };
  return object.foo();
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const object = {
      foo() {
        try {
          return [];
        } catch (t1) {
          return;
        }
      },
    };
    t0 = object.foo();
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};

```

### Eval output
(kind: ok) []