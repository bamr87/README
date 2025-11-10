---
category: misc
last_updated: null
source_file: repro-retain-source-when-bailout.expect.md
summary: '```javascript

  // @panicThreshold:"none"

  import {useNoAlias} from ''sharedruntime'';'
tags:
- javascript
title: Repro Retain Source When Bailout.Expect
---

## Input

```javascript
// @panicThreshold:"none"
import {useNoAlias} from 'shared-runtime';

const cond = true;
function useFoo(props) {
  props.x = 10;
  if (cond) bar();
  return useNoAlias({});

  function bar() {
    console.log('bar called');
    return 5;
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{}],
};

```

## Code

```javascript
// @panicThreshold:"none"
import { useNoAlias } from "shared-runtime";

const cond = true;
function useFoo(props) {
  props.x = 10;
  if (cond) bar();
  return useNoAlias({});

  function bar() {
    console.log("bar called");
    return 5;
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{}],
};

```
      
### Eval output
(kind: ok) {}
logs: ['bar called']