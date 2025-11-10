---
title: Escape Analysis Not Switch Test.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: escape-analysis-not-switch-test.expect.md
---
## Input

```javascript
function Component(props) {
  const a = [props.a];
  let x = props.b;
  switch (a) {
    case true: {
      x = props.c;
    }
  }
  return x;
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
  const a = [props.a];
  let x = props.b;
  switch (a) {
    case true: {
      x = props.c;
    }
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      