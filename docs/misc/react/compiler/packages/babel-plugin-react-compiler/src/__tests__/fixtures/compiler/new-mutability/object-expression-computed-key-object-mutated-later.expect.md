---
title: Object Expression Computed Key Object Mutated Later.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: object-expression-computed-key-object-mutated-later.expect.md
---
# Object Expression Computed Key Object Mutated Later.Expect

## Input

```javascript
// @enableNewMutationAliasingModel
import {identity, mutate} from 'shared-runtime';

function Component(props) {
  const key = {};
  const context = {
    [key]: identity([props.value]),
  };
  mutate(key);
  return context;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{value: 42}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @enableNewMutationAliasingModel
import { identity, mutate } from "shared-runtime";

function Component(props) {
  const $ = _c(2);
  let context;
  if ($[0] !== props.value) {
    const key = {};
    context = { [key]: identity([props.value]) };
    mutate(key);
    $[0] = props.value;
    $[1] = context;
  } else {
    context = $[1];
  }
  return context;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: 42 }],
};

```

### Eval output
(kind: ok) {"[object Object]":[42]}