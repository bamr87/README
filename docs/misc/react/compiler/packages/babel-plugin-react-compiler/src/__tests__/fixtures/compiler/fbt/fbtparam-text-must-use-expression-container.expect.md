---
category: misc
last_updated: null
source_file: fbtparam-text-must-use-expression-container.expect.md
summary: '```javascript

  import fbt from ''fbt'';'
tags:
- javascript
title: Fbtparam Text Must Use Expression Container.Expect
---

## Input

```javascript
import fbt from 'fbt';

function Component(props) {
  return (
    <Foo
      value={
        <fbt desc="Description of the parameter">
          <fbt:param name="value">{'0'}</fbt:param>%
        </fbt>
      }
    />
  );
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
import fbt from "fbt";

function Component(props) {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = (
      <Foo
        value={fbt._("{value}%", [fbt._param("value", "0")], { hk: "10F5Cc" })}
      />
    );
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

```
      