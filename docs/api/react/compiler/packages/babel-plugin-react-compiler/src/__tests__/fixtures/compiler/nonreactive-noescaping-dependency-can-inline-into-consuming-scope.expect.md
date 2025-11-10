---
category: api
last_updated: null
source_file: nonreactive-noescaping-dependency-can-inline-into-consuming-scope.expect.md
summary: "```javascript\n// @flow\nfunction Component() {\n  return (\n    <div\n\
  \      className={stylex(\n        // this value is a) in its own scope, b) nonreactive,\
  \ and c) nonescaping\n        // its scope gets pr..."
tags:
- javascript
- api
- api
title: Nonreactive Noescaping Dependency Can Inline Into Consuming Scope.Expect
---

## Input

```javascript
// @flow
function Component() {
  return (
    <div
      className={stylex(
        // this value is a) in its own scope, b) non-reactive, and c) non-escaping
        // its scope gets pruned bc it's non-escaping, but this doesn't mean we need to
        // create a temporary for it
        flags.feature('feature-name') ? styles.featureNameStyle : null
      )}></div>
  );
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
function Component() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = (
      <div
        className={stylex(
          flags.feature("feature-name") ? styles.featureNameStyle : null,
        )}
      />
    );
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

```
      
### Eval output
(kind: exception) Fixture not implemented