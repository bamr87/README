---
title: Usememo Labeled Statement Unconditional Return.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: useMemo-labeled-statement-unconditional-return.expect.md
---
# Usememo Labeled Statement Unconditional Return.Expect

## Input

```javascript
function Component(props) {
  const x = useMemo(() => {
    label: {
      return props.value;
    }
  });
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
  const x = props.value;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
