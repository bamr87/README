---
category: misc
last_updated: null
source_file: useMemo-inverted-if.expect.md
summary: "```javascript\nfunction Component(props) {\n  const x = useMemo(() => {\n\
  \    label: {\n      if (props.cond) {\n        break label;\n      }\n      return\
  \ props.a;\n    }\n    return props.b;\n  });\n  return x..."
tags:
- javascript
title: Usememo Inverted If.Expect
---

## Input

```javascript
function Component(props) {
  const x = useMemo(() => {
    label: {
      if (props.cond) {
        break label;
      }
      return props.a;
    }
    return props.b;
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
    bb1: {
      if (props.cond) {
        break bb1;
      }

      t0 = props.a;
      break bb0;
    }

    t0 = props.b;
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
      