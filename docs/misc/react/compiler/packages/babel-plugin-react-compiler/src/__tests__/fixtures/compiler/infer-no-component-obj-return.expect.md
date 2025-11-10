---
category: misc
last_updated: null
source_file: infer-no-component-obj-return.expect.md
summary: "```javascript\n// @compilationMode:\"infer\"\nfunction Component(props)\
  \ {\n  const ignore = <foo />;\n  return {foo: f(props)};\n}"
tags:
- javascript
title: Infer No Component Obj Return.Expect
---

## Input

```javascript
// @compilationMode:"infer"
function Component(props) {
  const ignore = <foo />;
  return {foo: f(props)};
}

function f(props) {
  return props;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};

```

## Code

```javascript
// @compilationMode:"infer"
function Component(props) {
  const ignore = <foo />;
  return { foo: f(props) };
}

function f(props) {
  return props;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};

```
      
### Eval output
(kind: ok) {"foo":{}}