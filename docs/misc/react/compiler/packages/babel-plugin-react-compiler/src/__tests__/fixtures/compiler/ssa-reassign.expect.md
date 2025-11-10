---
category: misc
last_updated: null
source_file: ssa-reassign.expect.md
summary: "```javascript\nfunction foo(a, b, c) {\n  let x = 0;\n  x = a;\n  x = b;\n\
  \  x = c;\n  return x;\n}"
tags:
- javascript
title: Ssa Reassign.Expect
---

## Input

```javascript
function foo(a, b, c) {
  let x = 0;
  x = a;
  x = b;
  x = c;
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
function foo(a, b, c) {
  let x;

  x = c;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      