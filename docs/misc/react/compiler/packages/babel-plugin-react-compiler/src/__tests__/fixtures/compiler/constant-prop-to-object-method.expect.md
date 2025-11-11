---
title: Constant Prop To Object Method.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: constant-prop-to-object-method.expect.md
---
# Constant Prop To Object Method.Expect

## Input

```javascript
import {identity} from 'shared-runtime';

function Foo() {
  const CONSTANT = 1;
  const x = {
    foo() {
      return identity(CONSTANT);
    },
  };
  return x.foo();
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
import { identity } from "shared-runtime";

function Foo() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const x = {
      foo() {
        return identity(1);
      },
    };
    t0 = x.foo();
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{}],
};

```

### Eval output
(kind: ok) 1