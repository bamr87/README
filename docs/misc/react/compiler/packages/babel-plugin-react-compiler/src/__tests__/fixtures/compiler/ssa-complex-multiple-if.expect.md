---
category: misc
last_updated: null
source_file: ssa-complex-multiple-if.expect.md
summary: "```javascript\nfunction foo() {\n  let x = 1;\n  let y = 2;\n  if (y ===\
  \ 2) {\n    x = 3;\n  }"
tags:
- javascript
title: Ssa Complex Multiple If.Expect
---

## Input

```javascript
function foo() {
  let x = 1;
  let y = 2;
  if (y === 2) {
    x = 3;
  }

  if (y === 3) {
    x = 5;
  }
  y = x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```

## Code

```javascript
function foo() {}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) 