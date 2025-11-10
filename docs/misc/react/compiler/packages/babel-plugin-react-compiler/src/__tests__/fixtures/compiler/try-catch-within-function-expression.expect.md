---
category: misc
last_updated: null
source_file: try-catch-within-function-expression.expect.md
summary: "```javascript\nfunction Component(props) {\n  const callback = () => {\n\
  \    try {\n      return [];\n    } catch (e) {\n      return;\n    }\n  };\n  return\
  \ callback();\n}"
tags:
- javascript
title: Try Catch Within Function Expression.Expect
---

## Input

```javascript
function Component(props) {
  const callback = () => {
    try {
      return [];
    } catch (e) {
      return;
    }
  };
  return callback();
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(1);
  const callback = _temp;
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = callback();
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}
function _temp() {
  try {
    return [];
  } catch (t0) {
    return;
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};

```
      
### Eval output
(kind: ok) []