---
category: misc
last_updated: null
source_file: for-empty-update.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x = 0;\n  for (let i =\
  \ 0; i < props.count; ) {\n    x += i;\n    if (x > 10) {\n      break;\n    }\n\
  \  }\n  return x;\n}"
tags:
- javascript
title: For Empty Update.Expect
---

## Input

```javascript
function Component(props) {
  let x = 0;
  for (let i = 0; i < props.count; ) {
    x += i;
    if (x > 10) {
      break;
    }
  }
  return x;
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
  let x = 0;
  for (const i = 0; 0 < props.count; ) {
    x = x + 0;
    if (x > 10) {
      break;
    }
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      