---
category: misc
last_updated: null
source_file: function-expression-with-store-to-parameter.expect.md
summary: "```javascript\nfunction Component(props) {\n  const mutate = (object, key,\
  \ value) => {\n    object.updated = true;\n    object[key] = value;\n  };\n  const\
  \ x = makeObject(props);\n  mutate(x);\n  return x;\n}"
tags:
- javascript
title: Function Expression With Store To Parameter.Expect
---

## Input

```javascript
function Component(props) {
  const mutate = (object, key, value) => {
    object.updated = true;
    object[key] = value;
  };
  const x = makeObject(props);
  mutate(x);
  return x;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  const mutate = _temp;
  let x;
  if ($[0] !== props) {
    x = makeObject(props);
    mutate(x);
    $[0] = props;
    $[1] = x;
  } else {
    x = $[1];
  }
  return x;
}
function _temp(object, key, value) {
  object.updated = true;
  object[key] = value;
}

```
      