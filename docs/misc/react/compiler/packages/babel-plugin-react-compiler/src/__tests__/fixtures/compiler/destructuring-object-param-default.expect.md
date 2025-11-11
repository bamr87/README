---
title: Destructuring Object Param Default.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: destructuring-object-param-default.expect.md
---
# Destructuring Object Param Default.Expect

## Input

```javascript
function Component({a = 2}) {
  return a;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function Component(t0) {
  const { a: t1 } = t0;
  const a = t1 === undefined ? 2 : t1;
  return a;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
