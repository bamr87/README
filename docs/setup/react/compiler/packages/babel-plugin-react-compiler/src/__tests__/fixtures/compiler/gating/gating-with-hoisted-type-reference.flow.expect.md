---
category: setup
last_updated: null
source_file: gating-with-hoisted-type-reference.flow.expect.md
summary: '```javascript

  // @flow @gating

  import {memo} from ''react'';'
tags:
- javascript
- setup
title: Gating With Hoisted Type Reference.Flow.Expect
---

## Input

```javascript
// @flow @gating
import {memo} from 'react';

type Props = React.ElementConfig<typeof Component>;

component Component(value: string) {
  return <div>{value}</div>;
}

export default memo<Props>(Component);

export const FIXTURE_ENTRYPOINT = {
  fn: eval('Component'),
  params: [{value: 'foo'}],
};

```

## Code

```javascript
import { c as _c } from "react/compiler-runtime";
import { isForgetEnabled_Fixtures } from "ReactForgetFeatureFlag";
import { memo } from "react";

type Props = React.ElementConfig<typeof Component>;
const Component = isForgetEnabled_Fixtures()
  ? function Component(t0) {
      const $ = _c(2);
      const { value } = t0;
      let t1;
      if ($[0] !== value) {
        t1 = <div>{value}</div>;
        $[0] = value;
        $[1] = t1;
      } else {
        t1 = $[1];
      }
      return t1;
    }
  : function Component({ value }: $ReadOnly<{ value: string }>) {
      return <div>{value}</div>;
    };

export default memo<Props>(Component);

export const FIXTURE_ENTRYPOINT = {
  fn: eval("Component"),
  params: [{ value: "foo" }],
};

```
      
### Eval output
(kind: ok) <div>foo</div>