---
title: Overlapping Scopes Interleaved By Terminal.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: overlapping-scopes-interleaved-by-terminal.expect.md
---
## Input

```javascript
function foo(a, b, c) {
  const x = [];
  const y = [];

  if (x) {
  }

  y.push(a);
  x.push(b);
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

  if (x) {
  }

  y.push(a);
  x.push(b);
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      