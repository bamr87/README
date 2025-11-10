---
category: misc
last_updated: null
source_file: rules-of-hooks-eacfcaa6ef89.expect.md
summary: "```javascript\n// Valid because hooks can be used in anonymous function\
  \ arguments to\n// memo.\nconst MemoizedFunction = memo(function (props) {\n  useHook();\n\
  \  return <button {...props} />;\n});"
tags:
- javascript
title: Rules Of Hooks Eacfcaa6Ef89.Expect
---

## Input

```javascript
// Valid because hooks can be used in anonymous function arguments to
// memo.
const MemoizedFunction = memo(function (props) {
  useHook();
  return <button {...props} />;
});

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // Valid because hooks can be used in anonymous function arguments to
// memo.
const MemoizedFunction = memo(function (props) {
  const $ = _c(2);
  useHook();
  let t0;
  if ($[0] !== props) {
    t0 = <button {...props} />;
    $[0] = props;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
});

```
      