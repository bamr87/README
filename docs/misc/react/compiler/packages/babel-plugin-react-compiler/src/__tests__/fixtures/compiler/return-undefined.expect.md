---
category: misc
last_updated: null
source_file: return-undefined.expect.md
summary: "```javascript\nfunction Component(props) {\n  if (props.cond) {\n    return\
  \ undefined;\n  }\n  return props.value;\n}"
tags:
- javascript
title: Return Undefined.Expect
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
      