---
category: misc
last_updated: null
source_file: mutate-through-boxing-unboxing-function-call-indirections-2.expect.md
summary: '```javascript

  // @enableNewMutationAliasingModel

  import {Stringify} from ''sharedruntime'';'
tags:
- javascript
title: Mutate Through Boxing Unboxing Function Call Indirections 2.Expect
---

## Input

```javascript
// @enableNewMutationAliasingModel
import {Stringify} from 'shared-runtime';

function Component({a, b}) {
  const x = {a, b};
  const f = () => {
    const y = [x];
    return y[0];
  };
  const x0 = f();
  const z = [x0];
  const x1 = z[0];
  x1.key = 'value';
  return <Stringify x={x} />;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{a: 0, b: 1}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @enableNewMutationAliasingModel
import { Stringify } from "shared-runtime";

function Component(t0) {
  const $ = _c(3);
  const { a, b } = t0;
  let t1;
  if ($[0] !== a || $[1] !== b) {
    const x = { a, b };
    const f = () => {
      const y = [x];
      return y[0];
    };

    const x0 = f();
    const z = [x0];
    const x1 = z[0];
    x1.key = "value";
    t1 = <Stringify x={x} />;
    $[0] = a;
    $[1] = b;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ a: 0, b: 1 }],
};

```
      
### Eval output
(kind: ok) <div>{"x":{"a":0,"b":1,"key":"value"}}</div>