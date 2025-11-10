---
category: misc
last_updated: null
source_file: useMemo-switch-return.expect.md
summary: "```javascript\nfunction Component(props) {\n  const x = useMemo(() => {\n\
  \    let y;\n    switch (props.switch) {\n      case 'foo': {\n        return 'foo';\n\
  \      }\n      case 'bar': {\n        y = 'bar';\n  ..."
tags:
- javascript
title: Usememo Switch Return.Expect
---

## Input

```javascript
function Component(props) {
  const x = useMemo(() => {
    let y;
    switch (props.switch) {
      case 'foo': {
        return 'foo';
      }
      case 'bar': {
        y = 'bar';
        break;
      }
      default: {
        y = props.y;
      }
    }
    return y;
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
  let t0;
  bb0: {
    let y;
    bb1: switch (props.switch) {
      case "foo": {
        t0 = "foo";
        break bb0;
      }
      case "bar": {
        y = "bar";
        break bb1;
      }
      default: {
        y = props.y;
      }
    }
    t0 = y;
  }
  const x = t0;
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      