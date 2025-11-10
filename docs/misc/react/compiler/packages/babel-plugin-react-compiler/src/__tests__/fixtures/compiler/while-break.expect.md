---
category: misc
last_updated: null
source_file: while-break.expect.md
summary: "```javascript\nfunction foo(a, b) {\n  while (a) {\n    break;\n  }\n  return\
  \ b;\n}"
tags:
- javascript
title: While Break.Expect
---

## Input

```javascript
function foo(a, b) {
  while (a) {
    break;
  }
  return b;
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
  while (a) {
    break;
  }
  return b;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      