---
category: misc
last_updated: null
source_file: object-method-shorthand-hook-dep.expect.md
summary: "```javascript\nimport {createHookWrapper} from 'sharedruntime';\nimport\
  \ {useState} from 'react';\nfunction useFoo() {\n  const [state, setState] = useState(false);\n\
  \  return {\n    func() {\n      return sta..."
tags:
- javascript
title: Object Method Shorthand Hook Dep.Expect
---

## Input

```javascript
import {createHookWrapper} from 'shared-runtime';
import {useState} from 'react';
function useFoo() {
  const [state, _setState] = useState(false);
  return {
    func() {
      return state;
    },
  };
}

export const FIXTURE_ENTRYPOINT = {
  fn: createHookWrapper(useFoo),
  params: [{}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
import { createHookWrapper } from "shared-runtime";
import { useState } from "react";
function useFoo() {
  const $ = _c(2);
  const [state] = useState(false);
  let t0;
  if ($[0] !== state) {
    t0 = {
      func() {
        return state;
      },
    };
    $[0] = state;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: createHookWrapper(useFoo),
  params: [{}],
};

```
      
### Eval output
(kind: ok) <div>{"result":{"func":{"kind":"Function","result":false}},"shouldInvokeFns":true}</div>