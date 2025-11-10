---
category: misc
last_updated: null
source_file: overlapping-scopes-interleaved-by-terminal.expect.md
summary: "```javascript\nfunction foo(a, b, c) {\n  const x = [];\n  const y = [];"
tags:
- javascript
title: Overlapping Scopes Interleaved By Terminal.Expect
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
      