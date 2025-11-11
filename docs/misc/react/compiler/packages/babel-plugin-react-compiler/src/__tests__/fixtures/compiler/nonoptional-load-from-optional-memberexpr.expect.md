---
title: Nonoptional Load From Optional Memberexpr.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: nonoptional-load-from-optional-memberexpr.expect.md
---
# Nonoptional Load From Optional Memberexpr.Expect

## Input

```javascript
// Note that `a?.b.c` is semantically different from `(a?.b).c`
// Here, 'props?.a` is an optional chain, and `.b` is an unconditional load
// (nullthrows if a is nullish)

function Component(props) {
  let x = (props?.a).b;
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
// Note that `a?.b.c` is semantically different from `(a?.b).c`
// Here, 'props?.a` is an optional chain, and `.b` is an unconditional load
// (nullthrows if a is nullish)

function Component(props) {
  const x = (props?.a).b;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
