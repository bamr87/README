---
category: misc
last_updated: null
source_file: capturing-func-alias-captured-mutate-arr.expect.md
summary: "```javascript\nimport {mutate} from 'sharedruntime';\nfunction Component({foo,\
  \ bar}) {\n  let x = {foo};\n  let y = {bar};\n  const f0 = function () {\n    let\
  \ a = [y];\n    let b = x;\n    a.x = b;\n  };\n  f0..."
tags:
- javascript
title: Capturing Func Alias Captured Mutate Arr.Expect
---

## Input

```javascript
import {mutate} from 'shared-runtime';
function Component({foo, bar}) {
  let x = {foo};
  let y = {bar};
  const f0 = function () {
    let a = [y];
    let b = x;
    a.x = b;
  };
  f0();
  mutate(y);
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{foo: 2, bar: 3}],
  sequentialRenders: [
    {foo: 2, bar: 3},
    {foo: 2, bar: 3},
    {foo: 2, bar: 4},
    {foo: 3, bar: 4},
  ],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
import { mutate } from "shared-runtime";
function Component(t0) {
  const $ = _c(3);
  const { foo, bar } = t0;
  let y;
  if ($[0] !== bar || $[1] !== foo) {
    const x = { foo };
    y = { bar };
    const f0 = function () {
      const a = [y];
      const b = x;
      a.x = b;
    };

    f0();
    mutate(y);
    $[0] = bar;
    $[1] = foo;
    $[2] = y;
  } else {
    y = $[2];
  }
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ foo: 2, bar: 3 }],
  sequentialRenders: [
    { foo: 2, bar: 3 },
    { foo: 2, bar: 3 },
    { foo: 2, bar: 4 },
    { foo: 3, bar: 4 },
  ],
};

```
      
### Eval output
(kind: ok) {"bar":3,"wat0":"joe"}
{"bar":3,"wat0":"joe"}
{"bar":4,"wat0":"joe"}
{"bar":4,"wat0":"joe"}