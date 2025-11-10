---
title: Arrow Function One Line Directive.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: arrow-function-one-line-directive.expect.md
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