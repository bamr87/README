---
category: misc
last_updated: null
source_file: basic-mutation-via-function-expression.expect.md
summary: "```javascript\n// @enableNewMutationAliasingModel\nfunction Component({a,\
  \ b}) {\n  const x = {a};\n  const y = [b];\n  const f = () => {\n    y.x = x;\n\
  \    mutate(y);\n  };\n  f();\n  return <div>{x}</div>;\n}"
tags:
- javascript
title: Basic Mutation Via Function Expression.Expect
---

## Input

```javascript
// @enableNewMutationAliasingModel
function Component({a, b}) {
  const x = {a};
  const y = [b];
  const f = () => {
    y.x = x;
    mutate(y);
  };
  f();
  return <div>{x}</div>;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @enableNewMutationAliasingModel
function Component(t0) {
  const $ = _c(3);
  const { a, b } = t0;
  let t1;
  if ($[0] !== a || $[1] !== b) {
    const x = { a };
    const y = [b];
    const f = () => {
      y.x = x;
      mutate(y);
    };

    f();
    t1 = <div>{x}</div>;
    $[0] = a;
    $[1] = b;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  return t1;
}

```
      
### Eval output
(kind: exception) Fixture not implemented