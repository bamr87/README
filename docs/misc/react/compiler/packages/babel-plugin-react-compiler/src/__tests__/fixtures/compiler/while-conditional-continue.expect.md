---
category: misc
last_updated: null
source_file: while-conditional-continue.expect.md
summary: "```javascript\nfunction foo(a, b, c, d) {\n  while (a) {\n    if (b) {\n\
  \      continue;\n    }\n    c();\n    continue;\n  }\n  d();\n}"
tags:
- javascript
title: While Conditional Continue.Expect
---

## Input

```javascript
function foo(a, b, c, d) {
  while (a) {
    if (b) {
      continue;
    }
    c();
    continue;
  }
  d();
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function foo(a, b, c, d) {
  while (a) {
    if (b) {
      continue;
    }

    c();
  }

  d();
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      