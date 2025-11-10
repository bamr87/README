---
title: Infer No Component Nested Jsx.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: infer-no-component-nested-jsx.expect.md
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