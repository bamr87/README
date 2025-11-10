---
category: misc
last_updated: null
source_file: ssa-single-if.expect.md
summary: "```javascript\nfunction foo() {\n  let x = 1;\n  let y = 2;"
tags:
- javascript
title: Ssa Single If.Expect
---

## Input

```javascript
function foo() {
  let x = 1;
  let y = 2;

  if (y) {
    let z = x + y;
  }
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