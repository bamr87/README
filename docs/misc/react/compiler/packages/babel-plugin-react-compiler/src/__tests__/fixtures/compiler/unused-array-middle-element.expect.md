---
title: Unused Array Middle Element.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: unused-array-middle-element.expect.md
---
# Unused Array Middle Element.Expect

## Input

```javascript
function foo(props) {
  const [x, unused, y] = props.a;
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
  const [x, , y] = props.a;
  return x + y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
