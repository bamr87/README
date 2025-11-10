---
category: misc
last_updated: null
source_file: escape-analysis-not-switch-test.expect.md
summary: "```javascript\nfunction Component(props) {\n  const a = [props.a];\n  let\
  \ x = props.b;\n  switch (a) {\n    case true: {\n      x = props.c;\n    }\n  }\n\
  \  return x;\n}"
tags:
- javascript
title: Escape Analysis Not Switch Test.Expect
---

## Input

```javascript
function Component(props) {
  const a = [props.a];
  let x = props.b;
  switch (a) {
    case true: {
      x = props.c;
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
  const a = [props.a];
  let x = props.b;
  switch (a) {
    case true: {
      x = props.c;
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
      