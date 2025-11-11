---
title: Capturing Function Member Expr Arguments.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: capturing-function-member-expr-arguments.expect.md
---
# Capturing Function Member Expr Arguments.Expect

## Input

```javascript
function Foo(props) {
  const onFoo = useCallback(
    reason => {
      log(props.router.location);
    },
    [props.router.location]
  );

  return onFoo;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Foo(props) {
  const $ = _c(2);
  let t0;
  if ($[0] !== props.router.location) {
    t0 = (reason) => {
      log(props.router.location);
    };
    $[0] = props.router.location;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const onFoo = t0;
  return onFoo;
}

```
