---
category: misc
last_updated: null
source_file: constant-propagation-for.expect.md
summary: "```javascript\nfunction foo() {\n  let y = 0;\n  for (const x = 100; x <\
  \ 10; x) {\n    y = y + 1;\n  }\n  return y;\n}"
tags:
- javascript
title: Constant Propagation For.Expect
---

## Input

```javascript
function foo() {
  let y = 0;
  for (const x = 100; x < 10; x) {
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

## Code

```javascript
function foo() {
  let y = 0;
  for (const x = 100; false; 100) {
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