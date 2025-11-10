---
title: Rules Of Hooks 9A47E97B5D13.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: rules-of-hooks-9a47e97b5d13.expect.md
---
## Input

```javascript
// Valid because hooks can be used in anonymous function arguments to
// forwardRef.
const FancyButton = React.forwardRef(function (props, ref) {
  useHook();
  return <button {...props} ref={ref} />;
});

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // Valid because hooks can be used in anonymous function arguments to
// forwardRef.
const FancyButton = React.forwardRef(function (props, ref) {
  const $ = _c(3);
  useHook();
  let t0;
  if ($[0] !== props || $[1] !== ref) {
    t0 = <button {...props} ref={ref} />;
    $[0] = props;
    $[1] = ref;
    $[2] = t0;
  } else {
    t0 = $[2];
  }
  return t0;
});

```
      