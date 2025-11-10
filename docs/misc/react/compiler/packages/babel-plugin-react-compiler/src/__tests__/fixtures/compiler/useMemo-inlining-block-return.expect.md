---
category: misc
last_updated: null
source_file: useMemo-inlining-block-return.expect.md
summary: "```javascript\nfunction component(a, b) {\n  let x = useMemo(() => {\n \
  \   if (a) {\n      return {b};\n    }\n  }, [a, b]);\n  return x;\n}"
tags:
- javascript
title: Usememo Inlining Block Return.Expect
---

## Input

```javascript
function component(a, b) {
  let x = useMemo(() => {
    if (a) {
      return {b};
    }
  }, [a, b]);
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function component(a, b) {
  const $ = _c(2);
  let t0;
  bb0: {
    if (a) {
      let t1;
      if ($[0] !== b) {
        t1 = { b };
        $[0] = b;
        $[1] = t1;
      } else {
        t1 = $[1];
      }
      t0 = t1;
      break bb0;
    }
    t0 = undefined;
  }
  const x = t0;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      