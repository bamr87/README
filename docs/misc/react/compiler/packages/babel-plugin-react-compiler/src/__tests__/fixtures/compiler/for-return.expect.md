---
category: misc
last_updated: null
source_file: for-return.expect.md
summary: "```javascript\nfunction Component(props) {\n  for (let i = 0; i < props.count;\
  \ i++) {\n    return;\n  }\n}"
tags:
- javascript
title: For Return.Expect
---

## Input

```javascript
function Component(props) {
  for (let i = 0; i < props.count; i++) {
    return;
  }
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
  for (const i = 0; 0 < props.count; ) {
    return;
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      