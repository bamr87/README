---
title: Type Annotation As Number .Flow.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: type-annotation-as-number_.flow.expect.md
---
## Input

```javascript
// @flow @enableUseTypeAnnotations
import {identity} from 'shared-runtime';

function Component(props: {id: number}) {
  const x = identity(props.id);
  const y = (x: number);
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{id: 42}],
};

```

## Code

```javascript
import { identity } from "shared-runtime";

function Component(props) {
  const x = identity(props.id);
  const y = (x: number);
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ id: 42 }],
};

```
      
### Eval output
(kind: ok) 42