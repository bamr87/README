---
category: misc
last_updated: null
source_file: reactive-dependencies-non-optional-properties-inside-optional-chain.expect.md
summary: "```javascript\nfunction Component(props) {\n  return props.post.feedback.comments?.edges?.map(render);\n\
  }"
tags:
- javascript
title: Reactive Dependencies Non Optional Properties Inside Optional Chain.Expect
---

## Input

```javascript
function Component(props) {
  return props.post.feedback.comments?.edges?.map(render);
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  let t0;
  if ($[0] !== props.post.feedback.comments?.edges) {
    t0 = props.post.feedback.comments?.edges?.map(render);
    $[0] = props.post.feedback.comments?.edges;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}

```
      