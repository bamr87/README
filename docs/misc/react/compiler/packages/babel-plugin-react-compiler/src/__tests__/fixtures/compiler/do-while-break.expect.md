---
title: Do While Break.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: do-while-break.expect.md
---
# Do While Break.Expect

## Input

```javascript
function Component(props) {
  do {
    break;
  } while (props.cond);
  return props;
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
  return props;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
