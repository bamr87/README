---
category: misc
last_updated: null
source_file: object-computed-access-assignment.expect.md
summary: "```javascript\nfunction foo(a, b, c) {\n  const x = {...a};\n  x[b] = c[b];\n\
  \  x[1 + 2] = c[b  4];\n}"
tags:
- javascript
title: Object Computed Access Assignment.Expect
---

## Input

```javascript
function foo(a, b, c) {
  const x = {...a};
  x[b] = c[b];
  x[1 + 2] = c[b * 4];
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
  const x = { ...a };
  x[b] = c[b];
  x[3] = c[b * 4];
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      