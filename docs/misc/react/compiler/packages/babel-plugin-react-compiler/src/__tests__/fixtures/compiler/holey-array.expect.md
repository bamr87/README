---
category: misc
last_updated: null
source_file: holey-array.expect.md
summary: "```javascript\nfunction t(props) {\n  let [, setstate] = useState();\n \
  \ setstate(1);\n  return props.foo;\n}"
tags:
- javascript
title: Holey Array.Expect
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
      