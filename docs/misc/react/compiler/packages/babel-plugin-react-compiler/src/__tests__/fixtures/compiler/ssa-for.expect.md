---
category: misc
last_updated: null
source_file: ssa-for.expect.md
summary: "```javascript\nfunction foo() {\n  let x = 1;\n  for (let i = 0; i < 10;\
  \ i++) {\n    x += 1;\n  }\n  return x;\n}"
tags:
- javascript
title: Ssa For.Expect
---

## Input

```javascript
function foo() {
  let x = 1;
  for (let i = 0; i < 10; i++) {
    x += 1;
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
  for (let i = 0; i < 10; i++) {
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
(kind: ok) 11