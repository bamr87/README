---
category: misc
last_updated: null
source_file: todo.bail.rules-of-hooks-e9f9bac89f8f.expect.md
summary: '```javascript

  // @skip

  // Unsupported input'
tags:
- javascript
title: Todo.Bail.Rules Of Hooks E9F9Bac89F8F.Expect
---

## Input

```javascript
// @skip
// Unsupported input

// Valid because hooks can be used in anonymous arrow-function arguments
// to forwardRef.
const FancyButton = React.forwardRef((props, ref) => {
  useHook();
  return <button {...props} ref={ref} />;
});

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @skip
// Unsupported input

// Valid because hooks can be used in anonymous arrow-function arguments
// to forwardRef.
const FancyButton = React.forwardRef((props, ref) => {
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
      