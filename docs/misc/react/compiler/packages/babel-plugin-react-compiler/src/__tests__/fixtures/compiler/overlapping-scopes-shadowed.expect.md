---
title: Overlapping Scopes Shadowed.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: overlapping-scopes-shadowed.expect.md
---
## Input

```javascript
function foo(a, b) {
  let x = [];
  let y = [];
  y.push(b);
  x.push(a);
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function foo(a, b) {
  const x = [];
  const y = [];
  y.push(b);
  x.push(a);
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      