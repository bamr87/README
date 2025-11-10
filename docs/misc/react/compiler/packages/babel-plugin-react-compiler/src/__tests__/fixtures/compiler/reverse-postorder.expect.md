---
category: misc
last_updated: null
source_file: reverse-postorder.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x;\n  if (props.cond)\
  \ {\n    switch (props.test) {\n      case 0: {\n        x = props.v0;\n       \
  \ break;\n      }\n      case 1: {\n        x = props.v1;\n    ..."
tags:
- javascript
- testing
title: Reverse Postorder.Expect
---

## Input

```javascript
function Component(props) {
  let x;
  if (props.cond) {
    switch (props.test) {
      case 0: {
        x = props.v0;
        break;
      }
      case 1: {
        x = props.v1;
        break;
      }
      case 2: {
      }
      default: {
        x = props.v2;
      }
    }
  } else {
    if (props.cond2) {
      x = props.b;
    } else {
      x = props.c;
    }
  }
  x;
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
    bb0: switch (props.test) {
      case 0: {
        break bb0;
      }
      case 1: {
        break bb0;
      }
      case 2:
      default:
    }
  } else {
    if (props.cond2) {
    }
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      