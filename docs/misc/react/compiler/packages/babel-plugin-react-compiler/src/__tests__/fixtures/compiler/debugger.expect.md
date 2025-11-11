---
title: Debugger.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: debugger.expect.md
---
# Debugger.Expect

## Input

```javascript
function Component(props) {
  debugger;
  if (props.cond) {
    debugger;
  } else {
    while (props.cond) {
      debugger;
    }
  }
  debugger;
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
  debugger;

  if (props.cond) {
    debugger;
  } else {
    while (props.cond) {
      debugger;
    }
  }
  debugger;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
