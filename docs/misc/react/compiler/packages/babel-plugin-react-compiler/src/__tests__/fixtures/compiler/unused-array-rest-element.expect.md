---
title: Unused Array Rest Element.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: unused-array-rest-element.expect.md
---
## Input

```javascript
function foo(props) {
  const [x, y, ...z] = props.a;
  return x + y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function foo(props) {
  const [x, y] = props.a;
  return x + y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      