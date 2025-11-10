---
title: Infer No Component Annot.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: infer-no-component-annot.expect.md
---
## Input

```javascript
// @compilationMode:"infer"
import {useIdentity, identity} from 'shared-runtime';

function Component(fakeProps: number) {
  const x = useIdentity(fakeProps);
  return identity(x);
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [42],
};

```

## Code

```javascript
// @compilationMode:"infer"
import { useIdentity, identity } from "shared-runtime";

function Component(fakeProps: number) {
  const x = useIdentity(fakeProps);
  return identity(x);
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [42],
};

```
      
### Eval output
(kind: ok) 42