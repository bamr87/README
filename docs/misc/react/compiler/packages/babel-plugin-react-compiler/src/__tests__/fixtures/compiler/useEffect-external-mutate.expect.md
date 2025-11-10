---
category: misc
last_updated: null
source_file: useEffect-external-mutate.expect.md
summary: '```javascript

  import {useEffect} from ''react'';'
tags:
- javascript
title: Useeffect External Mutate.Expect
---

## Input

```javascript
import {useEffect} from 'react';

let x = {a: 42};

function Component(props) {
  useEffect(() => {
    x.a = 10;
  });
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```

## Code

```javascript
import { useEffect } from "react";

let x = { a: 42 };

function Component(props) {
  useEffect(_temp);
}
function _temp() {
  x.a = 10;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```
      
### Eval output
(kind: ok) 