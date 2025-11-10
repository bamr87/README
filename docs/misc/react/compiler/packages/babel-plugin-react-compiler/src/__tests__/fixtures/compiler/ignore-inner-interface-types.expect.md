---
title: Ignore Inner Interface Types.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: ignore-inner-interface-types.expect.md
---
## Input

```javascript
function Foo() {
  type X = number;
  interface Bar {
    baz: number;
  }
  return 0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [],
};

```

## Code

```javascript
function Foo() {
  return 0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [],
};

```
      
### Eval output
(kind: ok) 0