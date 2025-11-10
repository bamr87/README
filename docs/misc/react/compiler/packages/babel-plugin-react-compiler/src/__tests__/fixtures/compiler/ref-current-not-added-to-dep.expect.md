---
category: misc
last_updated: null
source_file: ref-current-not-added-to-dep.expect.md
summary: "```javascript\nfunction VideoTab() {\n  const ref = useRef();\n  let x =\
  \ () => {\n    console.log(ref.current);\n  };"
tags:
- javascript
title: Ref Current Not Added To Dep.Expect
---

## Input

```javascript
function VideoTab() {
  const ref = useRef();
  let x = () => {
    console.log(ref.current);
  };

  return <VideoList videos={x} />;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function VideoTab() {
  const $ = _c(1);
  const ref = useRef();
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const x = () => {
      console.log(ref.current);
    };

    t0 = <VideoList videos={x} />;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

```
      