---
category: misc
last_updated: null
source_file: arrow-function-one-line-directive.expect.md
summary: "```javascript\nfunction useFoo() {\n  const update = () => {\n    'worklet';\n\
  \    return 1;\n  };\n  return update;\n}"
tags:
- javascript
title: Arrow Function One Line Directive.Expect
---

## Input

```javascript
function useFoo() {
  const update = () => {
    'worklet';
    return 1;
  };
  return update;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
function useFoo() {
  const update = _temp;
  return update;
}
function _temp() {
  "worklet";
  return 1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) "[[ function params=0 ]]"