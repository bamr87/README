---
category: misc
last_updated: null
source_file: no-emit-lint-repro.expect.md
summary: '```javascript

  // @inferEffectDependencies @noEmit

  import {print} from ''sharedruntime'';

  import useEffectWrapper from ''useEffectWrapper'';

  import {AUTODEPS} from ''react'';'
tags:
- javascript
title: No Emit Lint Repro.Expect
---

## Input

```javascript
// @inferEffectDependencies @noEmit
import {print} from 'shared-runtime';
import useEffectWrapper from 'useEffectWrapper';
import {AUTODEPS} from 'react';

function ReactiveVariable({propVal}) {
  const arr = [propVal];
  useEffectWrapper(() => print(arr), AUTODEPS);
}

```

## Code

```javascript
// @inferEffectDependencies @noEmit
import { print } from "shared-runtime";
import useEffectWrapper from "useEffectWrapper";
import { AUTODEPS } from "react";

function ReactiveVariable({ propVal }) {
  const arr = [propVal];
  useEffectWrapper(() => print(arr), AUTODEPS);
}

```
      
### Eval output
(kind: exception) Fixture not implemented