---
title: Overlapping Scopes While.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: overlapping-scopes-while.expect.md
---
## Input

```javascript
function foo(a, b, c) {
  let x = [];
  let y = [];
  while (c) {
    y.push(b);
    x.push(a);
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function foo(a, b, c) {
  const x = [];
  const y = [];
  while (c) {
    y.push(b);
    x.push(a);
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      