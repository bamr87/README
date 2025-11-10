---
category: misc
last_updated: null
source_file: simple-function-1.expect.md
summary: "```javascript\nfunction component() {\n  let x = function (a) {\n    a.foo();\n\
  \  };\n  return x;\n}"
tags:
- javascript
title: Simple Function 1.Expect
---

## Input

```javascript
function component() {
  let x = function (a) {
    a.foo();
  };
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
function component() {
  const x = _temp;
  return x;
}
function _temp(a) {
  a.foo();
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) "[[ function params=1 ]]"