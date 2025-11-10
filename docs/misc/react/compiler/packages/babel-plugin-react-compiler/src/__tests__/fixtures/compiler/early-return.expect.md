---
category: misc
last_updated: null
source_file: early-return.expect.md
summary: "```javascript\nfunction MyApp(props) {\n  let res;\n  if (props.cond) {\n\
  \    return;\n  } else {\n    res = 1;\n  }\n}"
tags:
- javascript
title: Early Return.Expect
---

## Input

```javascript
function MyApp(props) {
  let res;
  if (props.cond) {
    return;
  } else {
    res = 1;
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: MyApp,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function MyApp(props) {
  if (props.cond) {
    return;
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: MyApp,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      