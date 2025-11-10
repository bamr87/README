---
category: misc
last_updated: null
source_file: switch-with-fallthrough.expect.md
summary: "```javascript\nfunction foo(x) {\n  let y;\n  switch (x) {\n    case 0:\
  \ {\n      y = 0;\n    }\n    case 1: {\n      y = 1;\n    }\n    case 2: {\n  \
  \    break;\n    }\n    case 3: {\n      y = 3;\n      break;\n    }..."
tags:
- javascript
title: Switch With Fallthrough.Expect
---

## Input

```javascript
function foo(x) {
  let y;
  switch (x) {
    case 0: {
      y = 0;
    }
    case 1: {
      y = 1;
    }
    case 2: {
      break;
    }
    case 3: {
      y = 3;
      break;
    }
    case 4: {
      y = 4;
    }
    case 5: {
      y = 5;
    }
    default: {
      y = 0;
    }
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
function foo(x) {
  bb0: switch (x) {
    case 0:
    case 1:
    case 2: {
      break bb0;
    }
    case 3: {
      break bb0;
    }
    case 4:
    case 5:
    default:
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      