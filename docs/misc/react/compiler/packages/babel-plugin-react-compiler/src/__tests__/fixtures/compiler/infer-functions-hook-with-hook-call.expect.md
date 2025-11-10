---
category: misc
last_updated: null
source_file: infer-functions-hook-with-hook-call.expect.md
summary: "```javascript\n// @compilationMode:\"infer\"\nfunction useStateValue(props)\
  \ {\n  const [state, ] = useState(null);\n  return [state];\n}"
tags:
- javascript
title: Infer Functions Hook With Hook Call.Expect
---

## Input

```javascript
// @compilationMode:"infer"
function useStateValue(props) {
  const [state, _] = useState(null);
  return [state];
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @compilationMode:"infer"
function useStateValue(props) {
  const $ = _c(2);
  const [state] = useState(null);
  let t0;
  if ($[0] !== state) {
    t0 = [state];
    $[0] = state;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}

```
      