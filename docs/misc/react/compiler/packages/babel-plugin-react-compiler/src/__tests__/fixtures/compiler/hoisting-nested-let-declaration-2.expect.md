---
category: misc
last_updated: null
source_file: hoisting-nested-let-declaration-2.expect.md
summary: "```javascript\nfunction hoisting(cond) {\n  let items = [];\n  if (cond)\
  \ {\n    let foo = () => {\n      items.push(bar());\n    };\n    let bar = () =>\
  \ true;\n    foo();\n  }\n  return items;\n}"
tags:
- javascript
title: Hoisting Nested Let Declaration 2.Expect
---

## Input

```javascript
function hoisting(cond) {
  let items = [];
  if (cond) {
    let foo = () => {
      items.push(bar());
    };
    let bar = () => true;
    foo();
  }
  return items;
}

export const FIXTURE_ENTRYPOINT = {
  fn: hoisting,
  params: [true],
  isComponent: false,
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function hoisting(cond) {
  const $ = _c(2);
  let items;
  if ($[0] !== cond) {
    items = [];
    if (cond) {
      const foo = () => {
        items.push(bar());
      };

      let bar = _temp;
      foo();
    }
    $[0] = cond;
    $[1] = items;
  } else {
    items = $[1];
  }
  return items;
}
function _temp() {
  return true;
}

export const FIXTURE_ENTRYPOINT = {
  fn: hoisting,
  params: [true],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) [true]