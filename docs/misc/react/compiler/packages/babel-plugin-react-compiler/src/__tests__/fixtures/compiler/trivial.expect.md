---
category: misc
last_updated: null
source_file: trivial.expect.md
summary: "```javascript\nfunction foo(x) {\n  return x;\n}"
tags:
- javascript
title: Trivial.Expect
---

## Input

```javascript
function foo(x) {
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function foo(x) {
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      