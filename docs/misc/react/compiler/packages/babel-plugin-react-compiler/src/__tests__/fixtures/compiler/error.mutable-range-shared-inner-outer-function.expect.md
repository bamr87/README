---
category: misc
last_updated: null
source_file: error.mutable-range-shared-inner-outer-function.expect.md
summary: "```javascript\n// @enableAssumeHooksFollowRulesOfReact @enableTransitivelyFreezeFunctionExpressions\n\
  let cond = true;\nfunction Component(props) {\n  let a;\n  let b;\n  const f = ()\
  \ => {\n    if (cond) {\n  ..."
tags:
- javascript
title: Error.Mutable Range Shared Inner Outer Function.Expect
---

## Input

```javascript
// @enableAssumeHooksFollowRulesOfReact @enableTransitivelyFreezeFunctionExpressions
let cond = true;
function Component(props) {
  let a;
  let b;
  const f = () => {
    if (cond) {
      a = {};
      b = [];
    } else {
      a = {};
      b = [];
    }
    a.property = true;
    b.push(false);
  };
  return <div onClick={f} />;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};

```


## Error

```
Found 1 error:

Error: Cannot reassign variable after render completes

Reassigning `a` after render has completed can cause inconsistent behavior on subsequent renders. Consider using state instead.

error.mutable-range-shared-inner-outer-function.ts:8:6
   6 |   const f = () => {
   7 |     if (cond) {
>  8 |       a = {};
     |       ^ Cannot reassign `a` after render completes
   9 |       b = [];
  10 |     } else {
  11 |       a = {};
```
          
      