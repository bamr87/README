---
category: misc
last_updated: null
source_file: overlapping-scopes-interleaved.expect.md
summary: "```javascript\nfunction foo(a, b) {\n  let x = [];\n  let y = [];\n  x.push(a);\n\
  \  y.push(b);\n}"
tags:
- javascript
title: Overlapping Scopes Interleaved.Expect
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
      