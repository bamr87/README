---
category: misc
last_updated: null
source_file: useMemo-labeled-statement-unconditional-return.expect.md
summary: "```javascript\nfunction Component(props) {\n  const x = useMemo(() => {\n\
  \    label: {\n      return props.value;\n    }\n  });\n  return x;\n}"
tags:
- javascript
title: Usememo Labeled Statement Unconditional Return.Expect
---

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
      