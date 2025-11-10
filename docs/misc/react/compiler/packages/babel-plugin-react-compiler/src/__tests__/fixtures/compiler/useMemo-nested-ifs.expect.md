---
category: misc
last_updated: null
source_file: useMemo-nested-ifs.expect.md
summary: "```javascript\nfunction Component(props) {\n  const x = useMemo(() => {\n\
  \    if (props.cond) {\n      if (props.cond) {\n      }\n    }\n  }, [props.cond]);\n\
  \  return x;\n}"
tags:
- javascript
title: Usememo Nested Ifs.Expect
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
      