---
category: misc
last_updated: null
source_file: ssa-throw.expect.md
summary: "```javascript\nfunction foo() {\n  let x = 1;\n  if (x === 1) {\n    x =\
  \ 2;\n  }\n  throw x;\n}"
tags:
- javascript
title: Ssa Throw.Expect
---

## Input

```javascript
function foo() {
  let x = 1;
  if (x === 1) {
    x = 2;
  }
  throw x;
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
  throw 2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: exception) undefined