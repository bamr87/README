---
category: misc
last_updated: null
source_file: useMemo-logical.expect.md
summary: "```javascript\nfunction Component(props) {\n  const x = useMemo(() => props.a\
  \ && props.b);\n  return x;\n}"
tags:
- javascript
title: Usememo Logical.Expect
---

## Input

```javascript
function Component(props) {
  const x = useMemo(() => props.a && props.b);
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
  const x = props.a && props.b;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      