---
title: Ref Current Aliased Not Added To Dep 2.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: ref-current-aliased-not-added-to-dep-2.expect.md
---
# Ref Current Aliased Not Added To Dep 2.Expect

## Input

```javascript
// @validateRefAccessDuringRender:false
function Foo({a}) {
  const ref = useRef();
  const val = ref.current;
  const x = {a, val};

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
  const val = ref.current;
  let t1;
  if ($[0] !== a) {
    const x = { a, val };

    t1 = <VideoList videos={x} />;
    $[0] = a;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

```
