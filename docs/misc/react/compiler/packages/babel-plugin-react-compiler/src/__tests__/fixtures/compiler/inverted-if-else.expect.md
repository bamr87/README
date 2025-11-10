---
category: misc
last_updated: null
source_file: inverted-if-else.expect.md
summary: "```javascript\nfunction foo(a, b, c) {\n  let x = null;\n  label: {\n  \
  \  if (a) {\n      x = b;\n      break label;\n    }\n    x = c;\n  }\n  return\
  \ x;\n}"
tags:
- javascript
title: Inverted If Else.Expect
---

## Input

```javascript
function foo(a, b, c) {
  let x = null;
  label: {
    if (a) {
      x = b;
      break label;
    }
    x = c;
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function foo(a, b, c) {
  let x;
  bb0: {
    if (a) {
      x = b;
      break bb0;
    }

    x = c;
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      