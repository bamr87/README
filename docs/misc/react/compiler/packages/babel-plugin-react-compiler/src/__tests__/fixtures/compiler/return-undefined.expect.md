---
title: Return Undefined.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: return-undefined.expect.md
---
## Input

```javascript
function Component(props) {
  if (props.cond) {
    return undefined;
  }
  return props.value;
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
  if (props.cond) {
    return;
  }
  return props.value;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      