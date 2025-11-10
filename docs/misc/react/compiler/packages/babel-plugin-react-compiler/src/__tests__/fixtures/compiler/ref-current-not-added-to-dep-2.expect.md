---
category: misc
last_updated: null
source_file: ref-current-not-added-to-dep-2.expect.md
summary: "```javascript\n// @validateRefAccessDuringRender:false\nfunction Foo({a})\
  \ {\n  const ref = useRef();\n  const x = {a, val: ref.current};"
tags:
- javascript
title: Ref Current Not Added To Dep 2.Expect
---

## Input

```javascript
// @validateRefAccessDuringRender:false
function Foo({a}) {
  const ref = useRef();
  const x = {a, val: ref.current};

  return <VideoList videos={x} />;
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime"; // @validateRefAccessDuringRender:false
function Foo(t0) {
  const $ = _c(2);
  const { a } = t0;
  const ref = useRef();
  let t1;
  if ($[0] !== a) {
    const x = { a, val: ref.current };

    t1 = <VideoList videos={x} />;
    $[0] = a;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

```
      