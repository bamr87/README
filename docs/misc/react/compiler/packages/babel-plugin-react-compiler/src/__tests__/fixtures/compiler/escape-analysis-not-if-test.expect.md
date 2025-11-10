---
category: misc
last_updated: null
source_file: escape-analysis-not-if-test.expect.md
summary: "```javascript\nfunction Component(props) {\n  const x = [props.a];\n  let\
  \ y;\n  if (x) {\n    y = props.b;\n  } else {\n    y = props.c;\n  }\n  return\
  \ y;\n}"
tags:
- javascript
title: Escape Analysis Not If Test.Expect
---

## Input

```javascript
function Component(props) {
  const x = [props.a];
  let y;
  if (x) {
    y = props.b;
  } else {
    y = props.c;
  }
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
  let y;
  if (x) {
    y = props.b;
  } else {
    y = props.c;
  }
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      