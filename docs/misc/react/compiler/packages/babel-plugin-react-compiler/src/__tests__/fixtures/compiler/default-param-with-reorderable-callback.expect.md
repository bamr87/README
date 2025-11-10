---
category: misc
last_updated: null
source_file: default-param-with-reorderable-callback.expect.md
summary: "```javascript\nfunction Component(x = () => [1, true, 42.0, 'hello']) {\n\
  \  return x;\n}"
tags:
- javascript
title: Default Param With Reorderable Callback.Expect
---

## Input

```javascript
function Component(x = () => [-1, true, 42.0, 'hello']) {
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```

## Code

```javascript
function Component(t0) {
  const x = t0 === undefined ? _temp : t0;
  return x;
}
function _temp() {
  return [-1, true, 42, "hello"];
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```
      
### Eval output
(kind: ok) "[[ function params=0 ]]"