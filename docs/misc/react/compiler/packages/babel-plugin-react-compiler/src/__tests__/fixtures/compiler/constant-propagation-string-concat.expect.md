---
category: misc
last_updated: null
source_file: constant-propagation-string-concat.expect.md
summary: "```javascript\nfunction foo() {\n  const a = 'a' + 'b';\n  const c = 'c';\n\
  \  return a + c;\n}"
tags:
- javascript
title: Constant Propagation String Concat.Expect
---

## Input

```javascript
function foo() {
  const a = 'a' + 'b';
  const c = 'c';
  return a + c;
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
  return "abc";
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};

```
      
### Eval output
(kind: ok) "abc"