---
category: misc
last_updated: null
source_file: try-catch-within-object-method-returns-caught-value.expect.md
summary: '```javascript

  import {throwInput} from ''sharedruntime'';'
tags:
- javascript
title: Try Catch Within Object Method Returns Caught Value.Expect
---

## Input

```javascript
import {throwInput} from 'shared-runtime';

function Component(props) {
  const object = {
    foo() {
      try {
        throwInput([props.value]);
      } catch (e) {
        return e;
      }
    },
  };
  return object.foo();
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
    const object = {
      foo() {
        try {
          throwInput([props.value]);
        } catch (t1) {
          const e = t1;
          return e;
        }
      },
    };
    t0 = object.foo();
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