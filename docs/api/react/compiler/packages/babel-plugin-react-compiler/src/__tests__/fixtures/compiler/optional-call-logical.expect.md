---
category: api
last_updated: null
source_file: optional-call-logical.expect.md
summary: '```javascript

  import {useFragment} from ''sharedruntime'';'
tags:
- javascript
- api
- api
title: Optional Call Logical.Expect
---

## Input

```javascript
import {useFragment} from 'shared-runtime';

function Component(props) {
  const item = useFragment(
    graphql`
      fragment F on T {
        id
      }
    `,
    props.item
  );
  return item.items?.map(item => renderItem(item)) ?? [];
}

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
import { useFragment } from "shared-runtime";

function Component(props) {
  const $ = _c(2);
  const item = useFragment(
    graphql`
      fragment F on T {
        id
      }
    `,
    props.item,
  );
  let t0;
  if ($[0] !== item.items) {
    t0 = item.items?.map(_temp) ?? [];
    $[0] = item.items;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}
function _temp(item_0) {
  return renderItem(item_0);
}

```
      