---
category: misc
last_updated: null
source_file: for-empty-update-with-continue.expect.md
summary: "```javascript\nfunction Component(props) {\n  let x = 0;\n  for (let i =\
  \ 0; i < props.count; ) {\n    x += i;\n    i += 1;\n    continue;\n  }\n  return\
  \ x;\n}"
tags:
- javascript
title: For Empty Update With Continue.Expect
---

## Input

```javascript
function Component(props) {
  let x = 0;
  for (let i = 0; i < props.count; ) {
    x += i;
    i += 1;
    continue;
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
  for (let i = 0; i < props.count; ) {
    x = x + i;
    i = i + 1;
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      