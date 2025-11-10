---
category: misc
last_updated: null
source_file: constant-propagation-while.expect.md
summary: "```javascript\nfunction foo() {\n  let x = 100;\n  let y = 0;\n  while (x\
  \ < 10) {\n    y += 1;\n  }\n  return y;\n}"
tags:
- javascript
title: Constant Propagation While.Expect
---

## Input

```javascript
function foo() {
  let x = 100;
  let y = 0;
  while (x < 10) {
    y += 1;
  }
  return y;
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
  let y = 0;
  while (false) {
    y = y + 1;
  }
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) 0