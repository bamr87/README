---
title: Quoted Strings In Jsx Attribute Escaped.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: quoted-strings-in-jsx-attribute-escaped.expect.md
---
# Quoted Strings In Jsx Attribute Escaped.Expect

## Input

```javascript
export function Component() {
  return <Child text='Some \"text\"' />;
}

function Child(props) {
  return props.text;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
export function Component() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <Child text={'Some \\"text\\"'} />;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

function Child(props) {
  return props.text;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};

```

### Eval output
(kind: ok) Some \"text\"