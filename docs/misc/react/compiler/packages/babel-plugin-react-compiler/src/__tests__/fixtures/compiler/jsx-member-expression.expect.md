---
category: misc
last_updated: null
source_file: jsx-member-expression.expect.md
summary: "```javascript\nfunction Component(props) {\n  return (\n    <Sathya.Codes.Forget>\n\
  \      <Foo.Bar.Baz />\n    </Sathya.Codes.Forget>\n  );\n}"
tags:
- javascript
title: Jsx Member Expression.Expect
---

## Input

```javascript
function Component(props) {
  return (
    <Sathya.Codes.Forget>
      <Foo.Bar.Baz />
    </Sathya.Codes.Forget>
  );
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = (
      <Sathya.Codes.Forget>
        <Foo.Bar.Baz />
      </Sathya.Codes.Forget>
    );
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

```
      