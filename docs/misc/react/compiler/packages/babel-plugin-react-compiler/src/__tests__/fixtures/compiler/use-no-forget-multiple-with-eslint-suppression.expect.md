---
title: Use No Forget Multiple With Eslint Suppression.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: use-no-forget-multiple-with-eslint-suppression.expect.md
---
## Input

```javascript
import {useRef} from 'react';

const useControllableState = options => {};
function NoopComponent() {}

function Component() {
  'use no forget';
  const ref = useRef(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  ref.current = 'bad';
  return <button ref={ref} />;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```

## Code

```javascript
import { useRef } from "react";

const useControllableState = (options) => {};
function NoopComponent() {}

function Component() {
  "use no forget";
  const ref = useRef(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  ref.current = "bad";
  return <button ref={ref} />;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```
      
### Eval output
(kind: ok) <button></button>