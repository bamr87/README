---
title: Unmemoized Nonreactive Dependency Is Pruned As Dependency.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: unmemoized-nonreactive-dependency-is-pruned-as-dependency.expect.md
---
# Unmemoized Nonreactive Dependency Is Pruned As Dependency.Expect

## Input

```javascript
import {mutate, useNoAlias} from 'shared-runtime';

function Component(props) {
  // Here `x` cannot be memoized bc its mutable range spans a hook call:
  const x = [];
  useNoAlias();
  mutate(x);

  // However, `x` is non-reactive. It cannot semantically change, so we
  // exclude it as a dependency of the JSX element:
  return <div>{x}</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 42}],
};

```

## Code

```javascript
import { mutate, useNoAlias } from "shared-runtime";

function Component(props) {
  const x = [];
  useNoAlias();
  mutate(x);
  return <div>{x}</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: 42 }],
};

```

### Eval output
(kind: ok) <div>joe</div>