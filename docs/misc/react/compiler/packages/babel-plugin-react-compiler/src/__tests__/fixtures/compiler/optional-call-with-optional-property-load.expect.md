---
title: Optional Call With Optional Property Load.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: optional-call-with-optional-property-load.expect.md
---
## Input

```javascript
function Component(props) {
  return props?.items?.map?.(render)?.filter(Boolean) ?? [];
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  let t0;
  if ($[0] !== props?.items) {
    t0 = props?.items?.map?.(render)?.filter(Boolean) ?? [];
    $[0] = props?.items;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}

```
      