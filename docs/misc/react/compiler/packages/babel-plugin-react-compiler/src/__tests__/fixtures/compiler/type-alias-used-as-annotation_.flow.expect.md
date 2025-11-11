---
title: Type Alias Used As Annotation .Flow.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: type-alias-used-as-annotation_.flow.expect.md
---
# Type Alias Used As Annotation .Flow.Expect

## Input

```javascript
// @flow @enableAssumeHooksFollowRulesOfReact @enableTransitivelyFreezeFunctionExpressions
type Bar = string;
function TypeAliasUsedAsAnnotation() {
  type Foo = Bar;
  const fun = (f: Foo) => {
    console.log(f);
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
  console.log(f);
}

export const FIXTURE_ENTRYPOINT = {
  fn: TypeAliasUsedAsAnnotation,
  params: [],
};

```

### Eval output
(kind: ok)
logs: ['hello, world']