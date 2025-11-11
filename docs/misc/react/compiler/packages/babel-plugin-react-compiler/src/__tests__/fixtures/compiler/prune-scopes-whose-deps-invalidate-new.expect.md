---
title: Prune Scopes Whose Deps Invalidate New.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: prune-scopes-whose-deps-invalidate-new.expect.md
---
# Prune Scopes Whose Deps Invalidate New.Expect

## Input

```javascript
import {useHook} from 'shared-runtime';

function Component(props) {
  const x = new Foo();
  useHook(); // intersperse a hook call to prevent memoization of x
  x.value = props.value;

  const y = {x};

  return {y};
}

class Foo {}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 'sathya'}],
};

```

## Code

```javascript
import { useHook } from "shared-runtime";

function Component(props) {
  const x = new Foo();
  useHook();
  x.value = props.value;

  const y = { x };
  return { y };
}

class Foo {}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: "sathya" }],
};

```

### Eval output
(kind: ok) {"y":{"x":{"value":"sathya"}}}