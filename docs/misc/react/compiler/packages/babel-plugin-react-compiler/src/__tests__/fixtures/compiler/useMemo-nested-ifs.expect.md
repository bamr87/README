---
title: Usememo Nested Ifs.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: useMemo-nested-ifs.expect.md
---
## Input

```javascript
function Component(props) {
  const x = useMemo(() => {
    if (props.cond) {
      if (props.cond) {
      }
    }
  }, [props.cond]);
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
  if (props.cond) {
    if (props.cond) {
    }
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};

```
      