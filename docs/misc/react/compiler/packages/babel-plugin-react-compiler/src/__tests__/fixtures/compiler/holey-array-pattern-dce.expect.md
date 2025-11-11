---
title: Holey Array Pattern Dce.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: holey-array-pattern-dce.expect.md
---
# Holey Array Pattern Dce.Expect

## Input

```javascript
function t(props) {
  let [, foo, bar] = props;
  return foo;
}

export const FIXTURE_ENTRYPOINT = {
  fn: t,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function t(props) {
  const [, foo] = props;
  return foo;
}

export const FIXTURE_ENTRYPOINT = {
  fn: t,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
