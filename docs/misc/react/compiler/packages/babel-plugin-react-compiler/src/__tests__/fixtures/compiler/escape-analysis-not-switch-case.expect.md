---
category: misc
last_updated: null
source_file: escape-analysis-not-switch-case.expect.md
summary: "```javascript\nfunction Component(props) {\n  const a = [props.a];\n  let\
  \ x = props.b;\n  switch (props.c) {\n    case a: {\n      x = props.d;\n    }\n\
  \  }\n  return x;\n}"
tags:
- javascript
title: Escape Analysis Not Switch Case.Expect
---

## Input

```javascript
function Component(props) {
  const a = [props.a];
  let x = props.b;
  switch (props.c) {
    case a: {
      x = props.d;
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
  switch (props.c) {
    case a: {
      x = props.d;
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
      