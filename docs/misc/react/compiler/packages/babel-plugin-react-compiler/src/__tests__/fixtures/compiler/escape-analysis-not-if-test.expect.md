---
title: Escape Analysis Not If Test.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: escape-analysis-not-if-test.expect.md
---
## Input

```javascript
function Component(props) {
  const x = [props.a];
  let y;
  if (x) {
    y = props.b;
  } else {
    y = props.c;
  }
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function Component(props) {
  const x = [props.a];
  let y;
  if (x) {
    y = props.b;
  } else {
    y = props.c;
  }
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      