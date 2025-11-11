---
title: Useactionstate Dispatch Considered As Non Reactive.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: useActionState-dispatch-considered-as-non-reactive.expect.md
---
# Useactionstate Dispatch Considered As Non Reactive.Expect

## Input

```javascript
import {useActionState} from 'react';

function Component() {
  const [actionState, dispatchAction] = useActionState();
  const onSubmitAction = () => {
    dispatchAction();
  };
  return <Foo onSubmitAction={onSubmitAction} />;
}

function Foo() {}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
import { useActionState } from "react";

function Component() {
  const $ = _c(1);
  const [, dispatchAction] = useActionState();
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const onSubmitAction = () => {
      dispatchAction();
    };

    t0 = <Foo onSubmitAction={onSubmitAction} />;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

function Foo() {}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```

### Eval output
(kind: ok)