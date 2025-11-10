---
category: misc
last_updated: null
source_file: hoisting-recursive-call-within-lambda.expect.md
summary: "```javascript\nfunction Foo({}) {\n  const outer = val => {\n    const fact\
  \ = x => {\n      if (x <= 0) {\n        return 1;\n      }\n      return x  fact(x\
  \  1);\n    };\n    return fact(val);\n  };\n  return o..."
tags:
- javascript
title: Hoisting Recursive Call Within Lambda.Expect
---

## Input

```javascript
function Foo({}) {
  const outer = val => {
    const fact = x => {
      if (x <= 0) {
        return 1;
      }
      return x * fact(x - 1);
    };
    return fact(val);
  };
  return outer(3);
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Foo(t0) {
  const $ = _c(1);
  const outer = _temp;
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = outer(3);
    $[0] = t1;
  } else {
    t1 = $[0];
  }
  return t1;
}
function _temp(val) {
  const fact = (x) => {
    if (x <= 0) {
      return 1;
    }
    return x * fact(x - 1);
  };
  return fact(val);
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{}],
};

```
      
### Eval output
(kind: ok) 6