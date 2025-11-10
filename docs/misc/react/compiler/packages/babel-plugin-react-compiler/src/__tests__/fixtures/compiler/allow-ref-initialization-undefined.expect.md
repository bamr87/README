---
category: misc
last_updated: null
source_file: allow-ref-initialization-undefined.expect.md
summary: '```javascript

  //@flow

  import {useRef} from ''react'';'
tags:
- javascript
title: Allow Ref Initialization Undefined.Expect
---

## Input

```javascript
//@flow
import {useRef} from 'react';

component C() {
  const r = useRef(null);
  if (r.current == undefined) {
    r.current = 1;
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: C,
  params: [{}],
};

```

## Code

```javascript
import { useRef } from "react";

function C() {
  const r = useRef(null);
  if (r.current == undefined) {
    r.current = 1;
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: C,
  params: [{}],
};

```
      
### Eval output
(kind: ok) 