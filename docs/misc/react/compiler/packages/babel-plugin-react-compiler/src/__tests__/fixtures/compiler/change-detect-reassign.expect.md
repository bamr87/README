---
category: misc
last_updated: null
source_file: change-detect-reassign.expect.md
summary: "```javascript\n// @enableChangeDetectionForDebugging\nfunction Component(props)\
  \ {\n  let x = null;\n  if (props.cond) {\n    x = [];\n    x.push(props.value);\n\
  \  }\n  return x;\n}"
tags:
- javascript
title: Change Detect Reassign.Expect
---

## Input

```javascript
// @enableChangeDetectionForDebugging
function Component(props) {
  let x = null;
  if (props.cond) {
    x = [];
    x.push(props.value);
  }
  return x;
}

```

## Code

```javascript
import { $structuralCheck } from "react-compiler-runtime";
import { c as _c } from "react/compiler-runtime"; // @enableChangeDetectionForDebugging
function Component(props) {
  const $ = _c(2);
  let x = null;
  if (props.cond) {
    {
      x = [];
      x.push(props.value);
      let condition = $[0] !== props.value;
      if (!condition) {
        let old$x = $[1];
        $structuralCheck(old$x, x, "x", "Component", "cached", "(3:6)");
      }
      $[0] = props.value;
      $[1] = x;
      if (condition) {
        x = [];
        x.push(props.value);
        $structuralCheck($[1], x, "x", "Component", "recomputed", "(3:6)");
        x = $[1];
      }
    }
  }
  return x;
}

```
      