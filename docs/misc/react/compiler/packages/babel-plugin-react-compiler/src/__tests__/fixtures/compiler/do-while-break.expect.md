---
category: misc
last_updated: null
source_file: do-while-break.expect.md
summary: "```javascript\nfunction Component(props) {\n  do {\n    break;\n  } while\
  \ (props.cond);\n  return props;\n}"
tags:
- javascript
title: Do While Break.Expect
---

## Input

```javascript
function Component(props) {
  do {
    break;
  } while (props.cond);
  return props;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function Component(props) {
  return props;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      