---
title: Overlapping Scopes Interleaved.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: overlapping-scopes-interleaved.expect.md
---
## Input

```javascript
function foo(a, b) {
  let x = [];
  let y = [];
  x.push(a);
  y.push(b);
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
  x.push(a);
  y.push(b);
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      