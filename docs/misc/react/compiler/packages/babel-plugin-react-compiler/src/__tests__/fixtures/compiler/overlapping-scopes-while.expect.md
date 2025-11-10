---
category: misc
last_updated: null
source_file: overlapping-scopes-while.expect.md
summary: "```javascript\nfunction foo(a, b, c) {\n  let x = [];\n  let y = [];\n \
  \ while (c) {\n    y.push(b);\n    x.push(a);\n  }\n}"
tags:
- javascript
title: Overlapping Scopes While.Expect
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
      