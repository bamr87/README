---
title: Multiple Components First Is Invalid.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: multiple-components-first-is-invalid.expect.md
---
# Multiple Components First Is Invalid.Expect

## Input

```javascript
// @panicThreshold:"none"
import {useHook} from 'shared-runtime';

function InvalidComponent(props) {
  if (props.cond) {
    useHook();
  }
  return <div>Hello World!</div>;
}

function ValidComponent(props) {
  return <div>{props.greeting}</div>;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @panicThreshold:"none"
import { useHook } from "shared-runtime";

function InvalidComponent(props) {
  if (props.cond) {
    useHook();
  }
  return <div>Hello World!</div>;
}

function ValidComponent(props) {
  const $ = _c(2);
  let t0;
  if ($[0] !== props.greeting) {
    t0 = <div>{props.greeting}</div>;
    $[0] = props.greeting;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}

```

### Eval output
(kind: exception) Fixture not implemented