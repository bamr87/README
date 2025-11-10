---
title: Escape Analysis Not Switch Case.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: escape-analysis-not-switch-case.expect.md
---
## Input

```javascript
function Component(props) {
  const a = [props.a];
  let x = props.b;
  switch (props.c) {
    case a: {
      x = props.d;
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
  switch (props.c) {
    case a: {
      x = props.d;
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
      