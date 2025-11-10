---
category: misc
last_updated: null
source_file: holey-array-pattern-dce.expect.md
summary: "```javascript\nfunction t(props) {\n  let [, foo, bar] = props;\n  return\
  \ foo;\n}"
tags:
- javascript
title: Holey Array Pattern Dce.Expect
---

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
      