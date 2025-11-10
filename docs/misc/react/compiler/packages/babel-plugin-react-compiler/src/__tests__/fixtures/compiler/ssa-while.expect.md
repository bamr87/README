---
category: misc
last_updated: null
source_file: ssa-while.expect.md
summary: "```javascript\nfunction foo() {\n  let x = 1;\n  while (x < 10) {\n    x\
  \ = x + 1;\n  }"
tags:
- javascript
title: Ssa While.Expect
---

## Input

```javascript
function foo() {
  let x = 1;
  while (x < 10) {
    x = x + 1;
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
  let x = 1;
  while (x < 10) {
    x = x + 1;
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) 10