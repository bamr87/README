---
category: misc
last_updated: null
source_file: hoisting-recursive-call.expect.md
summary: "```javascript\nfunction Foo({value}: {value: number}) {\n  const factorial\
  \ = (x: number) => {\n    if (x <= 1) {\n      return 1;\n    } else {\n      return\
  \ x  factorial(x  1);\n    }\n  };"
tags:
- javascript
title: Hoisting Recursive Call.Expect
---

## Input

```javascript
function Foo({value}: {value: number}) {
  const factorial = (x: number) => {
    if (x <= 1) {
      return 1;
    } else {
      return x * factorial(x - 1);
    }
  };

  return factorial(value);
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{value: 3}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Foo(t0) {
  const $ = _c(2);
  const { value } = t0;
  let t1;
  if ($[0] !== value) {
    const factorial = (x) => {
      if (x <= 1) {
        return 1;
      } else {
        return x * factorial(x - 1);
      }
    };

    t1 = factorial(value);
    $[0] = value;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{ value: 3 }],
};

```
      
### Eval output
(kind: ok) 6