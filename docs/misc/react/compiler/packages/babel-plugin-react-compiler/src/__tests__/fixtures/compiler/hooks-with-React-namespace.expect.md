---
category: misc
last_updated: null
source_file: hooks-with-React-namespace.expect.md
summary: "```javascript\nfunction Component() {\n  const [x, setX] = React.useState(1);\n\
  \  return x;\n}"
tags:
- javascript
title: Hooks With React Namespace.Expect
---

## Input

```javascript
function Component() {
  const [x, setX] = React.useState(1);
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```

## Code

```javascript
function Component() {
  const [x] = React.useState(1);
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};

```
      
### Eval output
(kind: ok) 1