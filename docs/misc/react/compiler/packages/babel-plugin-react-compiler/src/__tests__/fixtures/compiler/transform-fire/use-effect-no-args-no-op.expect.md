---
title: Use Effect No Args No Op.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: use-effect-no-args-no-op.expect.md
---
## Input

```javascript
// @enableFire
import {fire} from 'react';

function Component(props) {
  useEffect();

  return null;
}

```

## Code

```javascript
// @enableFire
import { fire } from "react";

function Component(props) {
  useEffect();
  return null;
}

```
      
### Eval output
(kind: exception) Fixture not implemented