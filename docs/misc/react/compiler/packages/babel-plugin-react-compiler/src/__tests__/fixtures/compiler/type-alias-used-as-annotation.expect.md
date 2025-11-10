---
category: misc
last_updated: null
source_file: type-alias-used-as-annotation.expect.md
summary: "```javascript\n// @enableAssumeHooksFollowRulesOfReact @enableTransitivelyFreezeFunctionExpressions\n\
  type Bar = string;\nfunction TypeAliasUsedAsParamAnnotation() {\n  type Foo = Bar;\n\
  \  const fun = (f: Fo..."
tags:
- javascript
title: Type Alias Used As Annotation.Expect
---

## Input

```javascript
// @enableAssumeHooksFollowRulesOfReact @enableTransitivelyFreezeFunctionExpressions
type Bar = string;
function TypeAliasUsedAsParamAnnotation() {
  type Foo = Bar;
  const fun = (f: Foo) => {
    console.log(f);
  };
  fun('hello, world');
}

export const FIXTURE_ENTRYPOINT = {
  fn: TypeAliasUsedAsParamAnnotation,
  params: [],
};

```

## Code

```javascript
// @enableAssumeHooksFollowRulesOfReact @enableTransitivelyFreezeFunctionExpressions
type Bar = string;
function TypeAliasUsedAsParamAnnotation() {
  const fun = _temp;

  fun("hello, world");
}
function _temp(f) {
  console.log(f);
}

export const FIXTURE_ENTRYPOINT = {
  fn: TypeAliasUsedAsParamAnnotation,
  params: [],
};

```
      
### Eval output
(kind: ok) 
logs: ['hello, world']