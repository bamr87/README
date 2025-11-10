---
title: Inner Memo Value Not Promoted To Outer Scope Static.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: inner-memo-value-not-promoted-to-outer-scope-static.expect.md
---
## Input

```javascript
function Component(props) {
  const count = new MaybeMutable();
  return (
    <View>
      <View>
        {<span>Text</span>}
        {<span>{maybeMutate(count)}</span>}
      </View>
    </View>
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
    const count = new MaybeMutable();

    t0 = (
      <View>
        <View>
          <span>Text</span>
          <span>{maybeMutate(count)}</span>
        </View>
      </View>
    );
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

```
      