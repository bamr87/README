---
title: Type Alias Used As Variable Annotation .Flow.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: type-alias-used-as-variable-annotation_.flow.expect.md
---
# Type Alias Used As Variable Annotation .Flow.Expect

## Input

```javascript
// @flow @enableAssumeHooksFollowRulesOfReact @enableTransitivelyFreezeFunctionExpressions
type Bar = string;
function TypeAliasUsedAsAnnotation() {
  type Foo = Bar;
  const fun = f => {
    let g: Foo = f;
    console.log(g);
  };
  fun('hello, world');
}

export const FIXTURE_ENTRYPOINT = {
  fn: TypeAliasUsedAsAnnotation,
  params: [],
};

```

## Code

```javascript
type Bar = string;
function TypeAliasUsedAsAnnotation() {
  const fun = _temp;

  fun("hello, world");
}
function _temp(f) {
  const g = f;
  console.log(g);
}

export const FIXTURE_ENTRYPOINT = {
  fn: TypeAliasUsedAsAnnotation,
  params: [],
};

```

### Eval output
(kind: ok)
logs: ['hello, world']