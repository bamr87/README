---
category: misc
last_updated: null
source_file: destructuring-array-param-default.expect.md
summary: "```javascript\nfunction Component([a = 2]) {\n  return a;\n}"
tags:
- javascript
title: Destructuring Array Param Default.Expect
---

## Input

```javascript
function Component([a = 2]) {
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
  const [t1] = t0;
  const a = t1 === undefined ? 2 : t1;
  return a;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      