---
title: Mutate After Useeffect Granular Access.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: mutate-after-useeffect-granular-access.expect.md
---
# Mutate After Useeffect Granular Access.Expect

## Input

```javascript
// @inferEffectDependencies @panicThreshold:"none"
import {useEffect, AUTODEPS} from 'react';
import {print} from 'shared-runtime';

function Component({foo}) {
  const arr = [];
  // Taking either arr[0].value or arr as a dependency is reasonable
  // as long as developers know what to expect.
  useEffect(() => print(arr[0].value), AUTODEPS);
  arr.push({value: foo});
  return arr;
}

```

## Code

```javascript
// @inferEffectDependencies @panicThreshold:"none"
import { useEffect, AUTODEPS } from "react";
import { print } from "shared-runtime";

function Component(t0) {
  const { foo } = t0;
  const arr = [];

  useEffect(() => print(arr[0].value), [arr[0].value]);
  arr.push({ value: foo });
  return arr;
}

```

### Eval output
(kind: exception) Fixture not implemented