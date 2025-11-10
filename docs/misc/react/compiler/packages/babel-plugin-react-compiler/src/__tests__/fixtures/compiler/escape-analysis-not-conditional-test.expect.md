---
category: misc
last_updated: null
source_file: escape-analysis-not-conditional-test.expect.md
summary: "```javascript\nfunction Component(props) {\n  const x = [props.a];\n  const\
  \ y = x ? props.b : props.c;\n  return y;\n}"
tags:
- javascript
title: Escape Analysis Not Conditional Test.Expect
---

## Input

```javascript
function Component(props) {
  const x = [props.a];
  const y = x ? props.b : props.c;
  return y;
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
  const x = [props.a];
  const y = x ? props.b : props.c;
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      