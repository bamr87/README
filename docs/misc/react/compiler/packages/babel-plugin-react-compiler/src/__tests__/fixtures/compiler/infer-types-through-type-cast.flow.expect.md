---
category: misc
last_updated: null
source_file: infer-types-through-type-cast.flow.expect.md
summary: '```javascript

  // @flow

  import {getNumber} from ''sharedruntime'';'
tags:
- javascript
title: Infer Types Through Type Cast.Flow.Expect
---

## Input

```javascript
// @flow
import {getNumber} from 'shared-runtime';

function Component(props) {
  // We can infer that `x` is a primitive bc it is aliased to `y`,
  // which is used in a binary expression
  const x = getNumber();
  const y = (x: any);
  y + 1;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
  isComponent: false,
};

```

## Code

```javascript
import { getNumber } from "shared-runtime";

function Component(props) {
  const x = getNumber();
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) 4