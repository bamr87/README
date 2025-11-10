---
category: misc
last_updated: null
source_file: unused-array-rest-element.expect.md
summary: "```javascript\nfunction foo(props) {\n  const [x, y, ...z] = props.a;\n\
  \  return x + y;\n}"
tags:
- javascript
title: Unused Array Rest Element.Expect
---

## Input

```javascript
function foo(props) {
  const [x, y, ...z] = props.a;
  return x + y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ['TodoAdd'],
  isComponent: 'TodoAdd',
};

```

## Code

```javascript
function foo(props) {
  const [x, y] = props.a;
  return x + y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      