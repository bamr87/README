---
category: misc
last_updated: null
source_file: infer-no-component-nested-jsx.expect.md
summary: "```javascript\n// @compilationMode:\"infer\"\nfunction Component(props)\
  \ {\n  const result = f(props);\n  function helper() {\n    return <foo />;\n  }\n\
  \  helper();\n  return result;\n}"
tags:
- javascript
title: Infer No Component Nested Jsx.Expect
---

## Input

```javascript
// @compilationMode:"infer"
function Component(props) {
  const result = f(props);
  function helper() {
    return <foo />;
  }
  helper();
  return result;
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
  const result = f(props);
  function helper() {
    return <foo />;
  }
  helper();
  return result;
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
(kind: ok) {}