---
category: misc
last_updated: null
source_file: capturing-func-simple-alias.expect.md
summary: '```javascript

  import {mutate} from ''sharedruntime'';'
tags:
- javascript
title: Capturing Func Simple Alias.Expect
---

## Input

```javascript
import {mutate} from 'shared-runtime';

function Component({a}) {
  let x = {a};
  let y = {};
  const f0 = function () {
    y = x;
  };
  f0();
  mutate(y);
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{a: 2}],
  sequentialRenders: [{a: 2}, {a: 2}, {a: 3}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
import { mutate } from "shared-runtime";

function Component(t0) {
  const $ = _c(2);
  const { a } = t0;
  let y;
  if ($[0] !== a) {
    const x = { a };
    y = {};
    const f0 = function () {
      y = x;
    };

    f0();
    mutate(y);
    $[0] = a;
    $[1] = y;
  } else {
    y = $[1];
  }
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ a: 2 }],
  sequentialRenders: [{ a: 2 }, { a: 2 }, { a: 3 }],
};

```
      
### Eval output
(kind: ok) {"a":2,"wat0":"joe"}
{"a":2,"wat0":"joe"}
{"a":3,"wat0":"joe"}