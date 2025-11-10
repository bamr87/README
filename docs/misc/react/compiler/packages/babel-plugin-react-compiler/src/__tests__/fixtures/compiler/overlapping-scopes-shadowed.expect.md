---
category: misc
last_updated: null
source_file: overlapping-scopes-shadowed.expect.md
summary: "```javascript\nfunction foo(a, b) {\n  let x = [];\n  let y = [];\n  y.push(b);\n\
  \  x.push(a);\n}"
tags:
- javascript
title: Overlapping Scopes Shadowed.Expect
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
      