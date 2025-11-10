---
category: misc
last_updated: null
source_file: ssa-while-no-reassign.expect.md
summary: "```javascript\nfunction foo() {\n  let x = 1;\n  while (x < 10) {\n    x\
  \ + 1;\n  }"
tags:
- javascript
title: Ssa While No Reassign.Expect
---

## Input

```javascript
function foo() {
  let x = 1;
  while (x < 10) {
    x + 1;
  }

  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
function foo() {
  while (true) {}
  return 1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```
      