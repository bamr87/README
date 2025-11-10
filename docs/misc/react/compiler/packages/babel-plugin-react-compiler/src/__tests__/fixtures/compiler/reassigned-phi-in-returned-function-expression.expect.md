---
category: misc
last_updated: null
source_file: reassigned-phi-in-returned-function-expression.expect.md
summary: "```javascript\nfunction Component(props) {\n  return () => {\n    let str;\n\
  \    if (arguments.length) {\n      str = arguments[0];\n    } else {\n      str\
  \ = props.str;\n    }\n    global.log(str);\n  };\n}"
tags:
- javascript
title: Reassigned Phi In Returned Function Expression.Expect
---

## Input

```javascript
function Component(props) {
  return () => {
    let str;
    if (arguments.length) {
      str = arguments[0];
    } else {
      str = props.str;
    }
    global.log(str);
  };
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  let t0;
  if ($[0] !== props) {
    t0 = () => {
      let str;
      if (arguments.length) {
        str = arguments[0];
      } else {
        str = props.str;
      }

      global.log(str);
    };
    $[0] = props;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}

```
      