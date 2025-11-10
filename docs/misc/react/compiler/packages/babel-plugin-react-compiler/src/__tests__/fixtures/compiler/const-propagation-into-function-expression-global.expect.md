---
category: misc
last_updated: null
source_file: const-propagation-into-function-expression-global.expect.md
summary: "```javascript\nfunction foo() {\n  const isX = GLOBALISX;\n  const getJSX\
  \ = () => {\n    return <Child x={isX}></Child>;\n  };\n  const result = getJSX();\n\
  \  return result;\n}"
tags:
- javascript
title: Const Propagation Into Function Expression Global.Expect
---

## Input

```javascript
function foo() {
  const isX = GLOBAL_IS_X;
  const getJSX = () => {
    return <Child x={isX}></Child>;
  };
  const result = getJSX();
  return result;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function foo() {
  const $ = _c(1);

  const getJSX = _temp;
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = getJSX();
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const result = t0;
  return result;
}
function _temp() {
  return <Child x={GLOBAL_IS_X} />;
}

```
      