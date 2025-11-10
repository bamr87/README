---
category: misc
last_updated: null
source_file: iife-inline-ternary.expect.md
summary: "```javascript\nfunction Component(props) {\n  const x = props.foo\n    ?\
  \ 1\n    : (() => {\n        throw new Error('Did not receive 1');\n      })();\n\
  \  return items;\n}"
tags:
- javascript
title: Iife Inline Ternary.Expect
---

## Input

```javascript
function Component(props) {
  const x = props.foo
    ? 1
    : (() => {
        throw new Error('Did not receive 1');
      })();
  return items;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{foo: true}],
};

```

## Code

```javascript
function Component(props) {
  props.foo ? 1 : _temp();
  return items;
}
function _temp() {
  throw new Error("Did not receive 1");
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ foo: true }],
};

```
      
### Eval output
(kind: exception) items is not defined