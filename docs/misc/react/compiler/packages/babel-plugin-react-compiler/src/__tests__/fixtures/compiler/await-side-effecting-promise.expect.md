---
category: misc
last_updated: null
source_file: await-side-effecting-promise.expect.md
summary: "```javascript\nasync function Component(props) {\n  const x = [];\n  await\
  \ populateData(props.id, x);\n  return x;\n}"
tags:
- javascript
title: Await Side Effecting Promise.Expect
---

## Input

```javascript
async function Component(props) {
  const x = [];
  await populateData(props.id, x);
  return x;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
async function Component(props) {
  const $ = _c(2);
  let x;
  if ($[0] !== props.id) {
    x = [];
    await populateData(props.id, x);
    $[0] = props.id;
    $[1] = x;
  } else {
    x = $[1];
  }
  return x;
}

```
      