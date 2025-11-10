---
category: misc
last_updated: null
source_file: use-no-forget-with-eslint-suppression.expect.md
summary: '```javascript

  import {useRef} from ''react'';'
tags:
- javascript
title: Use No Forget With Eslint Suppression.Expect
---

## Input

```javascript
import {useRef} from 'react';

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