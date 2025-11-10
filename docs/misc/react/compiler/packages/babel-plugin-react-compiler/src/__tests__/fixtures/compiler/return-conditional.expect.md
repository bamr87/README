---
category: misc
last_updated: null
source_file: return-conditional.expect.md
summary: "```javascript\nfunction foo(a, b) {\n  if (a == null) {\n    return null;\n\
  \  } else {\n    return b;\n  }\n}"
tags:
- javascript
title: Return Conditional.Expect
---

## Input

```javascript
function foo(a, b) {
  if (a == null) {
    return null;
  } else {
    return b;
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function foo(a, b) {
  if (a == null) {
    return null;
  } else {
    return b;
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      