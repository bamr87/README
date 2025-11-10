---
title: Holey Array.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: holey-array.expect.md
---
## Input

```javascript
function t(props) {
  let [, setstate] = useState();
  setstate(1);
  return props.foo;
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
  const [, setstate] = useState();
  setstate(1);
  return props.foo;
}

export const FIXTURE_ENTRYPOINT = {
  fn: t,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      