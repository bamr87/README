---
category: misc
last_updated: null
source_file: ssa-simple.expect.md
summary: "```javascript\nfunction foo() {\n  let x = 1;\n  let y = 2;\n}"
tags:
- javascript
title: Ssa Simple.Expect
---

## Input

```javascript
function foo() {
  let x = 1;
  let y = 2;
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