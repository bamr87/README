---
category: misc
last_updated: null
source_file: type-alias-used-as-variable-annotation.expect.md
summary: "```javascript\n// @enableAssumeHooksFollowRulesOfReact @enableTransitivelyFreezeFunctionExpressions\n\
  type Bar = string;\nfunction TypeAliasUsedAsVariableAnnotation() {\n  type Foo =\
  \ Bar;\n  const fun = f =..."
tags:
- javascript
title: Type Alias Used As Variable Annotation.Expect
---

## Input

```javascript
// @enableAssumeHooksFollowRulesOfReact @enableTransitivelyFreezeFunctionExpressions
type Bar = string;
function TypeAliasUsedAsVariableAnnotation() {
  type Foo = Bar;
  const fun = f => {
    let g: Foo = f;
    console.log(g);
  };
  fun('hello, world');
}

export const FIXTURE_ENTRYPOINT = {
  fn: TypeAliasUsedAsVariableAnnotation,
  params: [],
};

```

## Code

```javascript
// @enableAssumeHooksFollowRulesOfReact @enableTransitivelyFreezeFunctionExpressions
type Bar = string;
function TypeAliasUsedAsVariableAnnotation() {
  const fun = _temp;

  fun("hello, world");
}
function _temp(f) {
  const g = f;
  console.log(g);
}

export const FIXTURE_ENTRYPOINT = {
  fn: TypeAliasUsedAsVariableAnnotation,
  params: [],
};

```
      
### Eval output
(kind: ok) 
logs: ['hello, world']