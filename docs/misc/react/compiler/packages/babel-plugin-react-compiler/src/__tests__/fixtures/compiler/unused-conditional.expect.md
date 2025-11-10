---
title: Unused Conditional.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: unused-conditional.expect.md
---
## Input

```javascript
function Component(props) {
  let x = 0;
  (x = 1) && (x = 2);
  return x;
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
  let x;
  ((x = 1), 1) && (x = 2);
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      