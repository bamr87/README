---
category: misc
last_updated: null
source_file: unconditional-break-label.expect.md
summary: "```javascript\nfunction foo(a) {\n  let x = 0;\n  bar: {\n    x = 1;\n \
  \   break bar;\n  }\n  return a + x;\n}"
tags:
- javascript
title: Unconditional Break Label.Expect
---

## Input

```javascript
function foo(a) {
  let x = 0;
  bar: {
    x = 1;
    break bar;
  }
  return a + x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function foo(a) {
  return a + 1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      