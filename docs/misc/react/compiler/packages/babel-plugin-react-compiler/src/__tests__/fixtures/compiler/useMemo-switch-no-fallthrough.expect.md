---
category: misc
last_updated: null
source_file: useMemo-switch-no-fallthrough.expect.md
summary: "```javascript\nfunction Component(props) {\n  const x = useMemo(() => {\n\
  \    switch (props.key) {\n      case 'key': {\n        return props.value;\n  \
  \    }\n      default: {\n        return props.defaultValu..."
tags:
- javascript
title: Usememo Switch No Fallthrough.Expect
---

## Input

```javascript
function Component(props) {
  const x = useMemo(() => {
    switch (props.key) {
      case 'key': {
        return props.value;
      }
      default: {
        return props.defaultValue;
      }
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
  let t0;
  bb0: switch (props.key) {
    case "key": {
      t0 = props.value;
      break bb0;
    }
    default: {
      t0 = props.defaultValue;
    }
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
      