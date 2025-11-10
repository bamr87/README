---
category: misc
last_updated: null
source_file: infer-phi-primitive.expect.md
summary: "```javascript\nfunction foo(a, b) {\n  let x;\n  if (a) {\n    x = 1;\n\
  \  } else {\n    x = 2;\n  }"
tags:
- javascript
title: Infer Phi Primitive.Expect
---

## Input

```javascript
function foo(a, b) {
  let x;
  if (a) {
    x = 1;
  } else {
    x = 2;
  }

  let y = x;
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [true, false],
  isComponent: false,
};

```

## Code

```javascript
function foo(a, b) {
  let x;
  if (a) {
    x = 1;
  } else {
    x = 2;
  }

  const y = x;
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [true, false],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) 1