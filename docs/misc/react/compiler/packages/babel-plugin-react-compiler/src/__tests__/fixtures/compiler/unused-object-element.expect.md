---
title: Unused Object Element.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: unused-object-element.expect.md
---
# Unused Object Element.Expect

## Input

```javascript
function Foo(props) {
  const {x, y, ...z} = props.a;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function Foo(props) {
  const { x } = props.a;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
