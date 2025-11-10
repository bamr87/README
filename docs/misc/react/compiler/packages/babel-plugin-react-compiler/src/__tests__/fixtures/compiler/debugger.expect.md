---
category: misc
last_updated: null
source_file: debugger.expect.md
summary: "```javascript\nfunction Component(props) {\n  debugger;\n  if (props.cond)\
  \ {\n    debugger;\n  } else {\n    while (props.cond) {\n      debugger;\n    }\n\
  \  }\n  debugger;\n}"
tags:
- javascript
title: Debugger.Expect
---

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
      