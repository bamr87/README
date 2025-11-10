---
title: Usememo Logical.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: useMemo-logical.expect.md
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
      